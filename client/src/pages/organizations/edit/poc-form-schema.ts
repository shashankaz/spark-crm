import { z } from "zod";

export const pocFormSchema = z.object({
  name: z
    .string("Please enter a name")
    .min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  mobile: z
    .string("Please enter a mobile number")
    .length(10, "Mobile number must be exactly 10 digits")
    .regex(/^\d+$/, "Mobile number must contain only digits"),
  designation: z
    .string("Please enter a designation")
    .min(1, "Designation is required"),
  isPrimary: z.boolean(),
});

export type POCFormValues = z.infer<typeof pocFormSchema>;
