import nodemailer from "nodemailer";

type SendOtpParams = {
  email: string;
  phone?: string | null;
  code: string;
  appName?: string;
};

type DeliveredTo = {
  email: string; // masked
  phone?: string; // masked
};

function maskEmail(email: string): string {
  const [user, domain] = (email || "").split("@");
  if (!user || !domain) return email;

  const u = user.length <= 2 ? `${user[0] || "*"}*` : `${user.slice(0, 2)}***`;
  const dParts = domain.split(".");
  const d0 = dParts[0] || domain;
  const dMasked = d0.length <= 2 ? `${d0[0] || "*"}*` : `${d0.slice(0, 2)}***`;
  const rest = dParts.length > 1 ? "." + dParts.slice(1).join(".") : "";

  return `${u}@${dMasked}${rest}`;
}

function maskPhone(phone: string): string {
  const digits = (phone || "").replace(/\D/g, "");
  if (digits.length <= 4) return "***";
  return `***${digits.slice(-4)}`;
}

function env(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim().length ? v.trim() : undefined;
}

function envBool(name: string, defaultValue: boolean): boolean {
  const v = env(name);
  if (!v) return defaultValue;
  return ["1", "true", "yes", "on"].includes(v.toLowerCase());
}

function envInt(name: string, defaultValue: number): number {
  const v = env(name);
  if (!v) return defaultValue;
  const n = Number(v);
  return Number.isFinite(n) ? n : defaultValue;
}

function isEmailConfigured() {
  return Boolean(
    env("EMAIL_SMTP_HOST") &&
    env("EMAIL_SMTP_PORT") &&
    env("EMAIL_SMTP_USER") &&
    env("EMAIL_SMTP_PASS") &&
    env("EMAIL_FROM"),
  );
}

function isSmsConfigured() {
  return Boolean(env("TWILIO_ACCOUNT_SID") && env("TWILIO_AUTH_TOKEN") && env("TWILIO_FROM_NUMBER"));
}

function buildEmailTransporter() {
  const host = env("EMAIL_SMTP_HOST")!;
  const port = envInt("EMAIL_SMTP_PORT", 587);
  const secure = envBool("EMAIL_SMTP_SECURE", false); // usually false for 587, true for 465
  const user = env("EMAIL_SMTP_USER")!;
  const pass = env("EMAIL_SMTP_PASS")!;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

function buildOtpEmailHtml(appName: string, code: string, ttlMinutes: number) {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2 style="margin: 0 0 12px;">${appName} verification code</h2>
      <p style="margin: 0 0 12px;">Use this code to verify your account:</p>
      <div style="font-size: 28px; font-weight: 700; letter-spacing: 4px; margin: 8px 0 16px;">
        ${code}
      </div>
      <p style="margin: 0; color: #666;">
        This code expires in ${ttlMinutes} minutes. If you did not request this, you can ignore this email.
      </p>
    </div>
  `;
}

function buildOtpSmsText(appName: string, code: string, ttlMinutes: number) {
  return `${appName}: Your verification code is ${code}. It expires in ${ttlMinutes} minutes.`;
}

function buildResetEmailHtml(appName: string, link: string, ttlMinutes: number) {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2 style="margin: 0 0 12px;">Reset your ${appName} password</h2>
      <p style="margin: 0 0 12px;">
        Click the link below to set a new password. This link expires in ${ttlMinutes} minutes.
      </p>
      <p style="margin: 0 0 12px;">
        <a href="${link}" target="_blank" rel="noreferrer">Reset password</a>
      </p>
      <p style="margin: 0; color: #666;">
        If you did not request this, you can ignore this email.
      </p>
    </div>
  `;
}

export async function sendOtp(params: SendOtpParams): Promise<{ deliveredTo: DeliveredTo }> {
  const appName = params.appName || env("APP_NAME") || "Web Banking";
  const ttlMinutes = envInt("OTP_TTL_MINUTES", 5);

  const deliveredTo: DeliveredTo = {
    email: maskEmail(params.email),
  };

  // Email
  if (isEmailConfigured()) {
    const transporter = buildEmailTransporter();
    const from = env("EMAIL_FROM")!;
    await transporter.sendMail({
      from,
      to: params.email,
      subject: `${appName} verification code`,
      html: buildOtpEmailHtml(appName, params.code, ttlMinutes),
      text: buildOtpSmsText(appName, params.code, ttlMinutes),
    });
  } else {
    // eslint-disable-next-line no-console
    console.log(`[DEV][EMAIL] OTP to ${params.email}: ${params.code}`);
  }

  return { deliveredTo };
}

export async function sendPasswordResetEmail(toEmail: string, resetLink: string, ttlMinutes: number) {
  const appName = env("APP_NAME") || "Web Banking";

  if (isEmailConfigured()) {
    const transporter = buildEmailTransporter();
    const from = env("EMAIL_FROM")!;
    await transporter.sendMail({
      from,
      to: toEmail,
      subject: `${appName} password reset`,
      html: buildResetEmailHtml(appName, resetLink, ttlMinutes),
      text: `Reset your password: ${resetLink}\n\nThis link expires in ${ttlMinutes} minutes.`,
    });
    return;
  }

  // eslint-disable-next-line no-console
  console.log(`[DEV][EMAIL] Password reset link to ${toEmail}: ${resetLink}`);
}
