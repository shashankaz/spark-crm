import { z } from "zod";

import { countries } from "@/utils/countries";

export const organizationFormSchema = z.object({
  name: z
    .string("Please enter organization name")
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
  country: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.enum([...countries], "Please select a valid country").optional(),
  ),
  email: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.email("Invalid email address").optional(),
  ),
  mobile: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z
      .string()
      .length(10, "Mobile number must be exactly 10 digits")
      .regex(/^\d+$/, "Mobile number must contain only digits")
      .optional(),
  ),
  website: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.url("Invalid website URL").optional(),
  ),
});

export type OrganizationFormValues = z.infer<typeof organizationFormSchema>;
