import { z } from "zod";

import { countries } from "@/utils/countries";

export const organizationFormSchema = z.object({
  name: z
    .string("Please enter organization name")
    .min(1, "Organization name is required"),
  industry: z
    .enum(
      [
        "Technology",
        "Finance",
        "Healthcare",
        "Education",
        "Retail",
        "Manufacturing",
        "Real Estate",
        "Other",
      ],
      "Please select a valid industry",
    )
    .optional(),
  size: z
    .enum(
      ["SMB", "Mid-Market", "Enterprise"],
      "Please select a valid organization size",
    )
    .optional(),
  country: z.enum([...countries], "Please select a valid country").optional(),
  email: z.email("Invalid email address").optional(),
  mobile: z
    .string()
    .length(10, "Mobile number must be exactly 10 digits")
    .regex(/^\d+$/, "Mobile number must contain only digits")
    .optional(),
  website: z.url("Invalid website URL").optional(),
});

export type OrganizationFormValues = z.infer<typeof organizationFormSchema>;
