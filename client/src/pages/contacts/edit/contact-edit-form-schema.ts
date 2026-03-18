import { z } from "zod";

export const contactEditSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional().or(z.literal("")),
  email: z.email("Invalid email address"),
  phone: z.string().optional().or(z.literal("")),
  jobTitle: z.string().optional().or(z.literal("")),
  department: z.string().optional().or(z.literal("")),
  orgName: z.string().optional().or(z.literal("")),
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

export type ContactEditFormValues = z.infer<typeof contactEditSchema>;
