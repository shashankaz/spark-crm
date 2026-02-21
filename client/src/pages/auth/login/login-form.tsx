import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
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

import { loginFormSchema } from "./login-form-schema";
import type { LoginFormValues } from "./login-form-schema";

import { loginUser } from "@/api/services/auth.service";

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

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const { user } = await loginUser(data);
      if (user) {
        console.log(user);
        toast.success("Logged in successfully!");
        if (user.role === "super_admin") navigate("/admin");
        else navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
      toast.error((error as Error).message);
    } finally {
      form.reset();
    }
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
        className="w-full h-11 rounded-full mt-4"
      >
        Sign in
      </Button>
    </form>
  );
};
