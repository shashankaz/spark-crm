import { z } from "zod";

export const dealFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  value: z.number().min(0, "Value must be a positive number."),
  probability: z
    .number()
    .min(0, "Probability must be between 0 and 100.")
    .max(100, "Probability must be between 0 and 100."),
});

export type DealFormValues = z.infer<typeof dealFormSchema>;
