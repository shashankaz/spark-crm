import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";

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

import { userEditSchema } from "./user-edit-form-scheme";
import type { UserEditFormValues } from "./user-edit-form-scheme";

import { PasswordInput } from "@/components/shared/password-input";

import { useUpdateUser } from "@/hooks";

import type { User } from "@/types";

interface UserEditFormProps {
  user: User;
}

export const UserEditForm: React.FC<UserEditFormProps> = ({ user }) => {
  const roleValue = user.role.toLowerCase() as UserEditFormValues["role"];

  const form = useForm<UserEditFormValues>({
    resolver: zodResolver(userEditSchema),
    mode: "onChange",
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName ?? "",
      email: user.email,
      mobile: user.mobile ?? "",
      role: roleValue,
      newPassword: "",
    },
  });

  useEffect(() => {
    form.reset({
      firstName: user.firstName,
      lastName: user.lastName ?? "",
      email: user.email,
      mobile: user.mobile ?? "",
      role: roleValue,
      newPassword: "",
    });
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const { mutate, isPending } = useUpdateUser();

  const onSubmit = (data: UserEditFormValues) => {
    mutate(
      {
        id: user._id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        mobile: data.mobile || undefined,
        password: data.newPassword || undefined,
        role: data.role,
      },
      {
        onSuccess: ({ message }) => {
          toast.success(message);
        },
        onError: ({ message }) => {
          toast.error(message);
        },
      },
    );
  };

  return (
    <form id="user-edit-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="grid grid-cols-2 gap-8 -space-y-4">
        <Controller
          name="firstName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel htmlFor="firstName">
                First Name <span className="text-error">*</span>
              </FieldLabel>
              <Input
                {...field}
                id="firstName"
                aria-invalid={fieldState.invalid}
                placeholder="Enter first name"
                autoComplete="off"
              />
              {fieldState.invalid && (
                <FieldError
                  className="text-error text-xs"
                  errors={[fieldState.error]}
                />
              )}
            </Field>
          )}
        />
        <Controller
          name="lastName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
              <Input
                {...field}
                id="lastName"
                aria-invalid={fieldState.invalid}
                placeholder="Enter last name"
                autoComplete="off"
              />
              {fieldState.invalid && (
                <FieldError
                  className="text-error text-xs"
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
              <FieldLabel htmlFor="email">
                Email <span className="text-error">*</span>
              </FieldLabel>
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
                  className="text-error text-xs"
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
              <FieldLabel htmlFor="mobile">
                Mobile <span className="text-error">*</span>
              </FieldLabel>
              <Input
                {...field}
                id="mobile"
                aria-invalid={fieldState.invalid}
                placeholder="Enter 10-digit mobile number"
                autoComplete="off"
              />
              {fieldState.invalid && (
                <FieldError
                  className="text-error text-xs"
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
              <FieldLabel htmlFor="role">
                Role <span className="text-error">*</span>
              </FieldLabel>
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
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {fieldState.invalid && (
                <FieldError
                  className="text-error text-xs"
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
          disabled={isPending}
          onClick={() =>
            form.reset({
              firstName: user.firstName,
              lastName: user.lastName ?? "",
              email: user.email,
              mobile: user.mobile ?? "",
              role: roleValue,
              newPassword: "",
            })
          }
        >
          Reset
        </Button>
        <Button type="submit" form="user-edit-form" disabled={isPending}>
          {isPending ? (
            <>
              <LoaderCircle className="animate-spin mr-2" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
};
