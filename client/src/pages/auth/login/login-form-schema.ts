import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.email("Invalid email address"),
  password: z
    .string("Password is required")
    .trim()
    .min(8)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
    ),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
