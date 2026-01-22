import { z } from "zod";

// Register schema
export const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters").max(100, "Password too long"),
  phone: z.string().regex(/^\+?\d{9,15}$/, "Invalid phone number format"),
});

// Verify OTP schema
export const verifyOtpSchema = z.object({
  email: z.string().email("Invalid email format"),
  code: z.string().length(6, "OTP must be 6 digits"),
});

// Login schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

// Transfer schema
export const transferSchema = z.object({
  toEmail: z.string().email("Invalid recipient email"),
  amount: z
    .number()
    .positive("Amount must be positive")
    .max(1000000, "Amount too large")
    .refine((val) => val > 0, "Amount must be greater than 0"),
});

// Forgot/Reset password schemas
export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(10, "Invalid token"),
  newPassword: z.string().min(8, "Password must be at least 8 characters").max(100, "Password too long"),
});

// Validation middleware factory
export function validate(schema: z.ZodSchema) {
  return (req: any, res: any, next: any) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
      }
      next(error);
    }
  };
}
