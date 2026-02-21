import { z } from "zod";

export const contactFormSchema = z.object({
  name: z
    .string("Please enter your name")
    .min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  company: z.string("Please enter your company name").optional(),
  message: z
    .string("Please enter your message")
    .min(10, "Message must be at least 10 characters"),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
