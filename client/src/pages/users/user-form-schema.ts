import { z } from "zod";

export const userFormSchema = z.object({
  name: z
    .string("Please enter a name")
    .min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  mobile: z
    .string("Please enter a mobile number")
    .length(10, "Mobile number must be exactly 10 digits")
    .regex(/^\d+$/, "Mobile number must contain only digits"),
  password: z
    .string("Please enter a password")
    .min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "user"], "Role must be either Admin or User"),
});

export type UserFormValues = z.infer<typeof userFormSchema>;
