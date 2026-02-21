import { z } from "zod";

export const leadFormSchema = z.object({
  firstName: z
    .string("Please enter first name")
    .min(2, "First name must be at least 2 characters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .optional(),
  email: z.email("Invalid email address"),
  mobile: z
    .string("Please enter a mobile number")
    .length(10, "Mobile number must be exactly 10 digits")
    .regex(/^\d+$/, "Mobile number must contain only digits"),
  gender: z.enum(["Male", "Female", "Other"], "Please select a valid gender"),
  organization: z
    .string()
    .regex(/^[a-fA-F0-9]{24}$/, "Please select a valid organization"),
  source: z.enum(
    [
      "Website",
      "Facebook Ads",
      "Google Ads",
      "Instagram",
      "LinkedIn",
      "Email Marketing",
      "Referral",
      "Cold Call",
      "WhatsApp",
      "Other",
    ],
    "Please select a valid source",
  ),
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;
