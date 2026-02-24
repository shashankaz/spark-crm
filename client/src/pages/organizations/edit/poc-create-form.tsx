import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { pocFormSchema } from "./poc-form-schema";
import type { POCFormValues } from "./poc-form-schema";

interface POCCreateFormProps {
  setOpen: (open: boolean) => void;
  onAdd: (data: POCFormValues) => void;
}

export const POCCreateForm: React.FC<POCCreateFormProps> = ({
  setOpen,
  onAdd,
}) => {
  const form = useForm<POCFormValues>({
    resolver: zodResolver(pocFormSchema),
    mode: "onChange",
    defaultValues: {
      name: undefined,
      email: undefined,
      mobile: undefined,
      designation: undefined,
      isPrimary: false,
    },
  });

  const onSubmit = (data: POCFormValues) => {
    try {
      onAdd(data);
    } catch (error) {
      console.error(error);
    } finally {
      form.reset();
      setOpen(false);
    }
  };

  return (
    <form id="poc-create-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="grid grid-cols-2 gap-8 -space-y-4">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel htmlFor="poc-name">Name</FieldLabel>
              <Input
                {...field}
                id="poc-name"
                aria-invalid={fieldState.invalid}
                placeholder="Enter full name"
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
          name="designation"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel htmlFor="poc-designation">Designation</FieldLabel>
              <Input
                {...field}
                id="poc-designation"
                aria-invalid={fieldState.invalid}
                placeholder="e.g. CTO, Sales Manager"
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
              <FieldLabel htmlFor="poc-email">Email</FieldLabel>
              <Input
                {...field}
                id="poc-email"
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
              <FieldLabel htmlFor="poc-mobile">Mobile</FieldLabel>
              <Input
                {...field}
                id="poc-mobile"
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
          name="isPrimary"
          control={form.control}
          render={({ field }) => (
            <div className="flex items-center gap-2 pt-6">
              <Checkbox
                id="poc-isPrimary"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <Label htmlFor="poc-isPrimary" className="text-sm cursor-pointer">
                Set as primary contact
              </Label>
            </div>
          )}
        />
      </FieldGroup>

      <div className="space-x-2 mt-4 flex justify-end">
        <Button type="button" variant="outline" onClick={() => form.reset()}>
          Reset
        </Button>
        <Button type="submit" form="poc-create-form">
          Add Contact
        </Button>
      </div>
    </form>
  );
};
