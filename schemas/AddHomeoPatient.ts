import { z } from "zod";

export const homeoPatientSchema = z.object({
  avatar: z.any().optional(),
  name: z.string().min(1, { message: "Name is required." }),
  oldSerialNumber: z.string().optional(),
  phone: z
    .string()
    .min(1, { message: "Phone number is required." })
    .regex(/^(\+8801|8801|01)[3-9]\d{8}$/, {
      message: "Invalid phone number.",
    }),
  relativePhone: z
    .string()
    .optional()
    .refine((val) => !val || /^(\+8801|8801|01)[3-9]\d{8}$/.test(val), {
      message: "Invalid relative phone number.",
    }),
  address: z.string().optional(),
});
