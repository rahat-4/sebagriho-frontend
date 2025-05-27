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

const optionalUrl = z.string().url("Invalid URL").or(z.literal("")).optional();
const optionalEmail = z
  .string()
  .email("Invalid email")
  .or(z.literal(""))
  .optional();
const optionalPhone = z
  .string()
  .min(11, "Phone number must be at least 11 digits")
  .max(11, "Phone number must be exactly 11 digits")
  .regex(/^[0-9]+$/, "Phone number must contain only digits")
  .or(z.literal(""))
  .optional();

export const organizationSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
  logo: z.any().optional(),
  organizationType: z.string().min(1, "Organization type is required"),
  description: z.string().optional(),
  phone: optionalPhone,
  email: optionalEmail,
  website: optionalUrl,
  address: z.string().min(1, "Address is required"),
  facebook: optionalUrl,
  twitter: optionalUrl,
  linkedin: optionalUrl,
  instagram: optionalUrl,
  youtube: optionalUrl,
});
