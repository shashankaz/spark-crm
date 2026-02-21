import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { PasswordInput } from "@/components/shared/password-input";

import type { User } from "@/types";

import { userEditSchema } from "./user-edit-form-scheme";
import type { UserEditFormValues } from "./user-edit-form-scheme";

interface UserEditFormProps {
  user: User;
}

export const UserEditForm: React.FC<UserEditFormProps> = ({ user }) => {
  const form = useForm<UserEditFormValues>({
    resolver: zodResolver(userEditSchema),
    mode: "onChange",
    defaultValues: {
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      newPassword: "",
    },
  });

  useEffect(() => {
    form.reset({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      newPassword: "",
    });
  }, [user, form]);

  const onSubmit = (data: UserEditFormValues) => {
    try {
      const payload = {
        ...data,
        ...(data.newPassword ? { password: data.newPassword } : {}),
      };
      delete (payload as { newPassword?: string }).newPassword;
      console.log("User updated:", payload);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form id="user-edit-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="grid grid-cols-2 gap-8 -space-y-4">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                {...field}
                id="name"
                aria-invalid={fieldState.invalid}
                placeholder="Enter full name"
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
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                {...field}
                id="email"
                type="email"
                aria-invalid={fieldState.invalid}
                placeholder="Enter email"
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
        <Controller
          name="mobile"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel htmlFor="mobile">Mobile</FieldLabel>
              <Input
                {...field}
                id="mobile"
                aria-invalid={fieldState.invalid}
                placeholder="Enter 10-digit mobile number"
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
        <Controller
          name="role"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel htmlFor="role">Role</FieldLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <SelectTrigger
                  className="w-full"
                  id="role"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="User">User</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {fieldState.invalid && (
                <FieldError
                  className="text-destructive text-xs"
                  errors={[fieldState.error]}
                />
              )}
            </Field>
          )}
        />

        <div className="col-span-2">
          <Separator />
          <p className="text-sm font-medium mt-3 mb-1">Change Password</p>
          <p className="text-xs text-muted-foreground mb-3">
            Leave blank to keep the current password.
          </p>
        </div>

        <PasswordInput
          form={form}
          name="newPassword"
          placeholder="Enter new password"
        />
      </FieldGroup>

      <div className="space-x-2 mt-6 flex justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            form.reset({
              name: user.name,
              email: user.email,
              mobile: user.mobile,
              role: user.role,
              newPassword: "",
            })
          }
        >
          Reset
        </Button>
        <Button type="submit" form="user-edit-form">
          Save Changes
        </Button>
      </div>
    </form>
  );
};
