import { z } from "zod";

export const contactFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  email: z.email("Invalid email address"),
  phone: z.string().optional(),
  jobTitle: z.string().optional(),
  department: z.string().optional(),
  orgId: z.string().optional(),
  orgName: z.string().optional(),
  linkedinUrl: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) =>
        !val ||
        /^https?:\/\/(www\.)?linkedin\.com\/(in|company|school|pub)\/[A-Za-z0-9\-_%]+\/?$/.test(
          val,
        ),
      { message: "Invalid LinkedIn URL" },
    ),
  website: z.url("Invalid URL").optional().or(z.literal("")),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
