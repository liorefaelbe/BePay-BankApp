import { Router } from "express";
import {
  register,
  verifyOtpController,
  resendOtpController,
  login,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller";
import { validate } from "../utils/validators";
import {
  registerSchema,
  verifyOtpSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../utils/validators";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/verify-otp", validate(verifyOtpSchema), verifyOtpController);
router.post("/resend-otp", resendOtpController);
router.post("/login", validate(loginSchema), login);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

export default router;
