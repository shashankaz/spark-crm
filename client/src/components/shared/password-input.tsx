import { useState } from "react";
import { Controller, useWatch } from "react-hook-form";
import type { FieldValues, UseFormReturn, Path } from "react-hook-form";
import { Eye, EyeOff, Check, X } from "lucide-react";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const complexityRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).+$/;

interface PasswordRule {
  label: string;
  test: (value: string) => boolean;
}

const PASSWORD_RULES: PasswordRule[] = [
  { label: "At least 8 characters", test: (v) => v.length >= 8 },
  { label: "No more than 64 characters", test: (v) => v.length <= 64 },
  { label: "At least one uppercase letter", test: (v) => /[A-Z]/.test(v) },
  { label: "At least one lowercase letter", test: (v) => /[a-z]/.test(v) },
  { label: "At least one number", test: (v) => /\d/.test(v) },
  {
    label: "At least one special character",
    test: (v) => complexityRegex.test(v),
  },
];

interface PasswordInputProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name?: Path<T>;
  placeholder?: string;
  label?: string;
  showRules?: boolean;
}

export const PasswordInput = <T extends FieldValues>({
  form,
  name = "password" as Path<T>,
  placeholder = "Enter password",
  label = "Password",
  showRules = false,
}: PasswordInputProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);
  const value: string = useWatch({ control: form.control, name }) ?? "";

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className="-space-y-2">
          <FieldLabel htmlFor={name}>
            {label} <span className="text-error">*</span>
          </FieldLabel>
          <div className="relative">
            <Input
              {...field}
              id={name}
              aria-invalid={fieldState.invalid}
              placeholder={placeholder}
              type={showPassword ? "text" : "password"}
              autoComplete="off"
              onCopy={(e) => e.preventDefault()}
            />
            <Button
              type="button"
              variant="ghost"
              className="absolute right-0 hover:bg-transparent focus:bg-transparent hover:cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>

          {showRules && value.length > 0 && (
            <ul className="space-y-1 pt-2">
              {PASSWORD_RULES.map((rule) => {
                const passed = rule.test(value);
                return (
                  <li
                    key={rule.label}
                    className={`flex items-center gap-1.5 text-xs ${passed ? "text-green-500" : "text-red-500"}`}
                  >
                    {passed ? (
                      <Check className="h-3 w-3 shrink-0" />
                    ) : (
                      <X className="h-3 w-3 shrink-0" />
                    )}
                    {rule.label}
                  </li>
                );
              })}
            </ul>
          )}

          {fieldState.invalid && (
            <FieldError
              className="text-error text-xs"
              errors={[fieldState.error]}
            />
          )}
        </Field>
      )}
    />
  );
};
