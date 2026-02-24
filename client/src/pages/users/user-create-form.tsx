import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { PasswordInput } from "@/components/shared/password-input";

import { userFormSchema } from "./user-form-schema";
import type { UserFormValues } from "./user-form-schema";

import { createUser } from "@/api/services/user.service";

interface UserCreateFormProps {
  setOpen: (open: boolean) => void;
}

export const UserCreateForm: React.FC<UserCreateFormProps> = ({ setOpen }) => {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    mode: "onChange",
    defaultValues: {
      firstName: undefined,
      lastName: undefined,
      email: undefined,
      mobile: undefined,
      password: undefined,
      role: undefined,
    },
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createUser,
    onSuccess: ({ message }) => {
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ["getAllUsers"] });
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      setOpen(false);
    },
  });

  const onSubmit = (data: UserFormValues) => {
    mutate({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      mobile: data.mobile || undefined,
      password: data.password,
      role: data.role,
    });
  };

  return (
    <form id="user-create-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="grid grid-cols-2 gap-8 -space-y-4">
        <Controller
          name="firstName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel htmlFor="firstName">First Name</FieldLabel>
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
              <FieldLabel htmlFor="lastName">
                Last Name{" "}
                <span className="text-muted-foreground text-xs">
                  (optional)
                </span>
              </FieldLabel>
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

        <PasswordInput
          form={form}
          name="password"
          placeholder="Enter password"
        />
      </FieldGroup>

      <div className="space-x-2 mt-4 flex justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => form.reset()}
          disabled={isPending}
        >
          Reset
        </Button>
        <Button
          type="submit"
          form="user-create-form"
          disabled={!form.formState.isValid || isPending}
        >
          {isPending ? (
            <>
              <LoaderCircle className="animate-spin mr-2" />
              Creating...
            </>
          ) : (
            "Create"
          )}
        </Button>
      </div>
    </form>
  );
};
