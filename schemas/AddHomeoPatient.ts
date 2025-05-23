import { z } from "zod";

export const homeoPatientSchemaStepOne = z.object({
  avatar: z.any().optional(),
  oldSerialNumber: z.string().optional(),
  name: z.string().min(1, { message: "Name is required." }),
  age: z.number().optional(),
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
});

export const homeoPatientSchemaStepTwo = z.object({
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  miasm: z
    .enum([
      "ACUTE",
      "TYPHOID",
      "MALARIAL",
      "RINGWORM",
      "PSORIC",
      "SYCOTIC",
      "CANCER",
      "TUBERCULAR",
      "LEPROSY",
      "SYPHILITIC",
      "AIDS",
    ])
    .optional(),
  caseHistory: z.string().optional(),
  habits: z.string().optional(),
  address: z.string().optional(),
});
