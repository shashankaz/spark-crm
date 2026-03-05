import { z } from "zod";

export const otpFormSchema = z.object({
  otp: z
    .string()
    .trim()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only digits"),
});

export type OtpFormValues = z.infer<typeof otpFormSchema>;
