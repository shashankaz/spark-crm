import { z } from "zod";

export const tenantFormSchema = z.object({
  name: z
    .string("Please enter a name")
    .min(2, "Name must be at least 2 characters"),
  gstNumber: z.string("Please enter a GST number").optional(),
  panNumber: z.string("Please enter a PAN number").optional(),
  email: z.email("Invalid email address"),
  mobile: z
    .string("Please enter a mobile number")
    .length(10, "Mobile number must be exactly 10 digits")
    .regex(/^\d+$/, "Mobile number must contain only digits"),
  address: z.object({
    line1: z.string("Please enter the address line 1"),
    line2: z.string("Please enter the address line 2").optional(),
    city: z.string("Please enter the city"),
    state: z.string("Please enter the state"),
    postalCode: z.string("Please enter the postal code"),
    country: z.string("Please enter the country"),
  }),
  plan: z.enum(["Free", "Basic", "Pro", "Enterprise"], "Please select a plan"),
});

export type TenantFormValues = z.infer<typeof tenantFormSchema>;
