import { z } from "zod";

export const homeopathicMedicineSchema = z.object({
  avatar: z.any().optional(),
  name: z.string().min(1, { message: "Name is required." }),
  power: z.string().optional(),
  expiration_date: z
    .string()
    .min(1, { message: "Expiration date is required." }),
  is_available: z.boolean({
    required_error: "Availability is required.",
    invalid_type_error: "Availability must be a boolean.",
  }),
  manufacturer: z.string().optional(),
  total_quantity: z.number().optional(),
  unit_price: z.number().optional(),
  description: z.string().optional(),
  batch_number: z.string().optional(),
});
