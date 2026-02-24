import { z } from "zod";

export const leadFormSchema = z.object({
  firstName: z
    .string("Please enter first name")
    .trim()
    .min(2, "First name must be at least 2 characters"),
  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .optional(),
  email: z.email("Invalid email address"),
  mobile: z
    .string("Please enter a mobile number")
    .trim()
    .length(10, "Mobile number must be exactly 10 digits")
    .regex(/^\d+$/, "Mobile number must contain only digits"),
  gender: z.enum(["male", "female", "other"], "Please select a valid gender"),
  organization: z
    .string()
    .regex(/^[a-fA-F0-9]{24}$/, "Please select a valid organization"),
  source: z.enum(
    [
      "website",
      "facebook ads",
      "google ads",
      "instagram",
      "linkedin",
      "email marketing",
      "referral",
      "cold call",
      "whatsApp",
      "other",
    ],
    "Please select a valid source",
  ),
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;
