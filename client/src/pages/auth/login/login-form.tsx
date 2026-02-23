import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { PasswordInput } from "@/components/shared/password-input";

import { useUser } from "@/hooks/use-user";

import { loginFormSchema } from "./login-form-schema";
import type { LoginFormValues } from "./login-form-schema";

import { useLogin } from "@/hooks/use-auth";

export const LoginForm = () => {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    mode: "onChange",
    defaultValues: {
      email: undefined,
      password: undefined,
    },
  });

  const navigate = useNavigate();
  const { setUser } = useUser();

  const { mutate, isPending } = useLogin();

  const onSubmit = (data: LoginFormValues) => {
    mutate(data, {
      onSuccess: ({ user, message }) => {
        setUser(user);
        toast.success(message);
        if (user.role === "super_admin") navigate("/admin", { replace: true });
        else navigate("/dashboard", { replace: true });
      },
      onError: ({ message }) => {
        toast.error(message);
        form.reset();
      },
    });
  };

  return (
    <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="-space-y-4">
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email
              </FieldLabel>
              <Input
                {...field}
                id="email"
                aria-invalid={fieldState.invalid}
                placeholder="you@example.com"
                autoComplete="off"
              />
              {fieldState.invalid && (
                <FieldError
                  className="text-destructive text-xs"
                  errors={[fieldState.error]}
                />
              )}
            </Field>
          )}
        />

        <PasswordInput form={form} placeholder="********" />
      </FieldGroup>

      <Button
        type="submit"
        form="login-form"
        disabled={!form.formState.isValid || isPending}
        className="w-full h-11 rounded-full mt-4"
      >
        {isPending ? (
          <>
            <LoaderCircle className="animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign in"
        )}
      </Button>
    </form>
  );
};
