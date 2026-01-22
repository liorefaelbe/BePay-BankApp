import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { generateOtp, verifyOtp } from "../services/otp.service";
import { generateToken } from "../services/jwt.service";
import { UserModel } from "../models/user.model";
import { sendOtp, sendPasswordResetEmail } from "../services/notification.service";
import { createPasswordResetToken, consumePasswordResetToken } from "../services/passwordReset.service";

function envBool(name: string, defaultValue: boolean): boolean {
  const v = process.env[name];
  if (!v) return defaultValue;
  return ["1", "true", "yes", "on"].includes(v.toLowerCase());
}

function envStr(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim().length ? v.trim() : undefined;
}

function envInt(name: string, defaultValue: number): number {
  const v = envStr(name);
  if (!v) return defaultValue;
  const n = Number(v);
  return Number.isFinite(n) ? n : defaultValue;
}

// Registration controller - creates unverified user
export async function register(req: Request, res: Response) {
  try {
    const { email, password, phone } = req.body;

    const existingUser = await UserModel.findOne({ email });

    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    if (existingUser) {
      existingUser.passwordHash = passwordHash;
      existingUser.phone = phone;
      await existingUser.save();
    } else {
      await UserModel.create({
        email,
        passwordHash,
        phone,
        balance: 0,
        isVerified: false,
      });
    }

    const otp = generateOtp(email);

    const { deliveredTo } = await sendOtp({
      email,
      phone,
      code: otp,
    });

    const showOtp = envBool("DEV_SHOW_OTP", true);

    return res.json({
      message: "OTP sent",
      email,
      deliveredTo,
      ...(showOtp ? { otp } : {}),
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("REGISTER_ERROR:", error);
    return res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

// OTP verification - activates user
export async function verifyOtpController(req: Request, res: Response) {
  try {
    const { email, code } = req.body;

    const isValid = verifyOtp(email, code);

    if (!isValid) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    user.isVerified = true;
    user.balance = Math.floor(Math.random() * 5000) + 1000;
    await user.save();

    // Keep backward compatibility: token still returned (FE may ignore)
    const token = generateToken(user.email);

    return res.json({
      message: "Account verified successfully. Please log in to continue.",
      verified: true,
      token,
      user: {
        email: user.email,
        balance: user.balance,
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("VERIFY_OTP_ERROR:", error);
    return res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

// Resend OTP - sends a new OTP to email and (if exists) phone
export async function resendOtpController(req: Request, res: Response) {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    const otp = generateOtp(email);

    const { deliveredTo } = await sendOtp({
      email,
      phone: user.phone,
      code: otp,
    });

    const showOtp = envBool("DEV_SHOW_OTP", true);

    return res.json({
      message: "OTP resent",
      email,
      deliveredTo,
      ...(showOtp ? { otp } : {}),
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("RESEND_OTP_ERROR:", error);
    return res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

// Login controller - only allow verified users
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: "Please verify your email first" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user.email);

    return res.json({
      token,
      user: {
        email: user.email,
        balance: user.balance,
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("LOGIN_ERROR:", error);
    return res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

// Forgot password - always returns success message
export async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;

    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();
    const user = await UserModel.findOne({ email: normalizedEmail });

    if (user) {
      const { rawToken, ttlMinutes } = createPasswordResetToken(normalizedEmail);

      const feBase = envStr("FRONTEND_BASE_URL") || "http://localhost:5173";
      const resetLink = `${feBase}/reset-password?token=${rawToken}`;

      await sendPasswordResetEmail(normalizedEmail, resetLink, ttlMinutes);
    }

    return res.json({
      message: "If the email exists, a reset link was sent",
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("FORGOT_PASSWORD_ERROR:", error);
    return res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

// Reset password - consumes token and updates passwordHash
export async function resetPassword(req: Request, res: Response) {
  try {
    const { token, newPassword } = req.body;

    const consumed = consumePasswordResetToken(String(token || ""));
    if (!consumed.ok) {
      return res.status(400).json({
        message: consumed.reason === "EXPIRED" ? "Token expired" : "Invalid token",
      });
    }

    const user = await UserModel.findOne({ email: consumed.email });
    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }

    user.passwordHash = await bcrypt.hash(String(newPassword || ""), 10);
    await user.save();

    return res.json({ message: "Password updated successfully" });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("RESET_PASSWORD_ERROR:", error);
    return res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
