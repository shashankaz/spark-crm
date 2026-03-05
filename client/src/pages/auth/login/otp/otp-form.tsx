import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";

import { OTP_SESSION_KEY } from ".";

import { otpFormSchema } from "./otp-form-schema";
import type { OtpFormValues } from "./otp-form-schema";

import { getProfile } from "@/api/services";

import { useVerifyOtp, useUser } from "@/hooks";

const roleHomeMap = {
  super_admin: "/admin",
  admin: "/dashboard",
  user: "/dashboard",
} as const;

interface OTPFormProps {
  userId: string;
}

export const OTPForm = ({ userId }: OTPFormProps) => {
  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpFormSchema),
    mode: "onChange",
    defaultValues: {
      otp: "",
    },
  });

  const navigate = useNavigate();
  const { setUser } = useUser();
  const { mutate, isPending } = useVerifyOtp();

  const onSubmit = (data: OtpFormValues) => {
    mutate(
      { userId, otp: data.otp },
      {
        onSuccess: async ({ message }) => {
          toast.success(message);
          sessionStorage.removeItem(OTP_SESSION_KEY);

          try {
            const { user } = await getProfile();
            setUser(user);
            navigate(roleHomeMap[user.role], { replace: true });
          } catch {
            toast.error("Failed to load profile. Please sign in again.");
            navigate("/login", { replace: true });
          }
        },
        onError: ({ message }) => {
          toast.error(message);
          form.reset();
        },
      },
    );
  };

  return (
    <form id="otp-form" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="flex flex-col items-center gap-4">
        <Controller
          name="otp"
          control={form.control}
          render={({ field, fieldState }) => (
            <div className="flex flex-col items-center gap-2">
              <InputOTP
                maxLength={6}
                value={field.value}
                onChange={field.onChange}
                aria-invalid={fieldState.invalid}
                containerClassName="gap-2"
              >
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPGroup key={i}>
                    <InputOTPSlot index={i} />
                  </InputOTPGroup>
                ))}
              </InputOTP>
              {fieldState.invalid && (
                <FieldError
                  className="text-error text-xs text-center"
                  errors={[fieldState.error]}
                />
              )}
            </div>
          )}
        />
      </div>

      <Button
        type="submit"
        form="otp-form"
        disabled={!form.formState.isValid || isPending}
        className="w-full h-11 rounded-full mt-6"
      >
        {isPending ? (
          <>
            <LoaderCircle className="animate-spin" />
            Verifying...
          </>
        ) : (
          "Verify OTP"
        )}
      </Button>
    </form>
  );
};
