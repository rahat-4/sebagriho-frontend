import { z } from "zod";

export const patientAppointmentSchema = z.object({
  symptoms: z.string().min(1, { message: "Symptoms are required." }),
  treatmentEffectiveness: z.string().optional(),
  appointmentFile: z.any().optional(),
  medicines: z
    .array(z.object({ uid: z.string().uuid() }))
    .transform((arr) => arr.map((m) => m.uid))
    .optional(),
});

// import { z } from "zod";

// export const patientAppointmentSchema = z.object({
//   symptoms: z.string().min(1, { message: "Symptoms are required." }),
//   treatmentEffectiveness: z.string().optional(),
//   appointmentFile: z.any().optional(),
//   medicines: z
//     .array(
//       z.object({
//         uid: z.string().uuid(),
//         name: z.string(),
//         power: z.string().optional(),
//         total_quantity: z.number().optional(),
//         unit_price: z.number().optional(),
//       })
//     )
//     .optional()
//     .default([]),
// });
