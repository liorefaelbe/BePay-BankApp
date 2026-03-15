<<<<<<< HEAD
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
=======
import { Router } from "express";
import {
  register,
  verifyOtpController,
  resendOtpController,
  login,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller";
// import { authLimiter, otpLimiter } from "../middlewares/rateLimit.middleware";
import { validate } from "../utils/validators";
import {
  registerSchema,
  verifyOtpSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../utils/validators";

const router = Router();

router.post("/register", /*authLimiter,*/ validate(registerSchema), register);
router.post("/verify-otp", /*otpLimiter,*/ validate(verifyOtpSchema), verifyOtpController);
router.post("/resend-otp", /*otpLimiter,*/ resendOtpController);
router.post("/login", /*authLimiter,*/ validate(loginSchema), login);
router.post("/forgot-password", /*authLimiter,*/ validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", /*authLimiter,*/ validate(resetPasswordSchema), resetPassword);

export default router;
>>>>>>> 3021c2567a6c53da578b52677e4f94c9ea73a29f
