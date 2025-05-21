import { z } from "zod";

// User Registration Schema
export const userSchema = z.object({
  avatar: z.any().optional(),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  email: z.string().email({ message: "Invalid email" }),
  gender: z.string().min(1, { message: "Gender is required" }),
  nid: z.string().min(1, { message: "National ID number is required" }),
  nidFrontImage: z.any().optional(),
  nidBackImage: z.any().optional(),
});

// OTP Schema
export const otpSchema = z.object({
  otp: z.string().min(6, { message: "OTP is required" }),
});

// Organization Schema
export const organizationSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
  logo: z.any().optional(),
  organization_type: z.string().min(1, "Organization type is required"),
  description: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional(),
  website: z.string().url("Invalid URL").optional(),
  address: z.string().optional(),
  facebook: z.string().url("Invalid URL").optional(),
  twitter: z.string().url("Invalid URL").optional(),
  linkedin: z.string().url("Invalid URL").optional(),
  instagram: z.string().url("Invalid URL").optional(),
  youtube: z.string().url("Invalid URL").optional(),
});
