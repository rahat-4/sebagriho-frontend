import { z } from "zod";

// User Registration Schema
export const userSchema = z.object({
  avatar: z.any().optional(),
  name: z.string().min(1, { message: "Name is required" }),
  phone: z
    .string()
    .min(11, "Phone number must be at least 11 digits")
    .max(11, "Phone number must be exactly 11 digits")
    .regex(/^[0-9]+$/, "Phone number must contain only digits"),
  email: z.string().email({ message: "Invalid email" }).optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  nid: z.string().min(1, { message: "National ID number is required" }),
  nidFrontImage: z.any().optional(),
  nidBackImage: z.any().optional(),
});

// OTP Schema
export const otpSchema = z.object({
  otp: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

// Organization Schema
export const organizationSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
  logo: z.any().optional(),
  organizationType: z.string().min(1, "Organization type is required"),
  description: z.string().optional(),
  phone: z
    .string()
    .min(11, "Phone number must be at least 11 digits")
    .max(11, "Phone number must be exactly 11 digits")
    .regex(/^[0-9]+$/, "Phone number must contain only digits")
    .optional(),
  email: z.string().email("Invalid email").optional(),
  website: z.string().url("Invalid URL").optional(),
  address: z.string().min(1, "Address is required"),
  facebook: z.string().url("Invalid URL").optional(),
  twitter: z.string().url("Invalid URL").optional(),
  linkedin: z.string().url("Invalid URL").optional(),
  instagram: z.string().url("Invalid URL").optional(),
  youtube: z.string().url("Invalid URL").optional(),
});
