import { z } from "zod";

import { countries } from "@/utils/countries";

export const organizationFormSchema = z.object({
  name: z
    .string("Please enter organization name")
    .trim()
    .min(2, "Organization name is required"),
  industry: z.enum(
    [
      "technology",
      "finance",
      "healthcare",
      "education",
      "retail",
      "manufacturing",
      "real estate",
      "other",
    ],
    "Please select a valid industry",
  ),
  size: z.enum(
    ["smb", "mid-market", "enterprise"],
    "Please select a valid organization size",
  ),
  country: z.enum([...countries], "Please select a valid country"),
  email: z.email("Invalid email address").optional(),
  mobile: z
    .string()
    .trim()
    .length(10, "Mobile number must be exactly 10 digits")
    .regex(/^\d+$/, "Mobile number must contain only digits")
    .optional(),
  website: z.url("Invalid website URL").optional(),
});

export type OrganizationFormValues = z.infer<typeof organizationFormSchema>;
