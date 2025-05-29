import { z } from "zod";

export const loginSchema = z.object({
  phone: z
    .string()
    .min(11, "Phone number must be at least 11 digits")
    .max(11, "Phone number must be exactly 11 digits")
    .regex(/^[0-9]+$/, "Phone number must contain only digits"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password is too long"),
  rememberMe: z.boolean().optional(),
});

export const phoneVerificationSchema = z.object({
  phone: z
    .string()
    .min(11, "Phone number must be at least 11 digits")
    .max(11, "Phone number must be exactly 11 digits")
    .regex(/^[0-9]+$/, "Phone number must contain only digits"),
});

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password is too long"),
  confirmPassword: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password is too long"),
});
