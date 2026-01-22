import rateLimit from "express-rate-limit";

// Rate limiter for authentication endpoints (login, register)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per windowMs
  message: {
    message: "Too many attempts, please try again later",
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
});

// Rate limiter for OTP requests
export const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // 3 OTP requests per 5 minutes
  message: {
    message: "Too many OTP requests, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for transfer endpoints
export const transferLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 transfers per minute
  message: {
    message: "Too many transfer requests, please slow down",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
