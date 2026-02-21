import { useState } from "react";
import { Controller } from "react-hook-form";
import type { FieldValues, UseFormReturn, Path } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PasswordInputProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name?: Path<T>;
  placeholder?: string;
}

export const PasswordInput = <T extends FieldValues>({
  form,
  name = "password" as Path<T>,
  placeholder = "Enter password",
}: PasswordInputProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className="-space-y-2">
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <div className="relative">
            <Input
              {...field}
              id="password"
              aria-invalid={fieldState.invalid}
              placeholder={placeholder}
              type={showPassword ? "text" : "password"}
              autoComplete="off"
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
          {fieldState.invalid && (
            <FieldError
              className="text-destructive text-xs"
              errors={[fieldState.error]}
            />
          )}
        </Field>
      )}
    />
  );
};
