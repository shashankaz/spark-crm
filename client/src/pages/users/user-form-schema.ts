import { z } from "zod";

export const userFormSchema = z.object({
  firstName: z
    .string("Please enter a first name")
    .trim()
    .min(2, "First name must be at least 2 characters"),
  lastName: z.string().trim().optional(),
  email: z.email("Invalid email address"),
  mobile: z
    .string()
    .trim()
    .length(10, "Mobile number must be exactly 10 digits")
    .regex(/^\d+$/, "Mobile number must contain only digits")
    .optional()
    .or(z.literal("")),
  password: z
    .string("Please enter a password")
    .trim()
    .min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "user"], "Role must be either Admin or User"),
});

export type UserFormValues = z.infer<typeof userFormSchema>;
