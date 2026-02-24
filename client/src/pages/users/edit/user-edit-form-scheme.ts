import { z } from "zod";

export const userEditSchema = z.object({
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
  role: z.enum(["admin", "user"], "Role must be either Admin or User"),
  newPassword: z
    .string()
    .trim()
    .min(6, "Password must be at least 6 characters")
    .optional()
    .or(z.literal("")),
});

export type UserEditFormValues = z.infer<typeof userEditSchema>;
