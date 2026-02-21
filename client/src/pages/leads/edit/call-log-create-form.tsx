import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

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

import { callLogFormSchema } from "./call-log-form-schema";
import type { CallLogFormValues } from "./call-log-form-schema";

interface CallLogCreateFormProps {
  setOpen: (open: boolean) => void;
  onAdd: (data: CallLogFormValues) => void;
}

export const CallLogCreateForm: React.FC<CallLogCreateFormProps> = ({
  setOpen,
  onAdd,
}) => {
  const form = useForm<CallLogFormValues>({
    resolver: zodResolver(callLogFormSchema),
    mode: "onChange",
    defaultValues: {
      type: undefined,
      to: "",
      from: "",
      status: undefined,
      duration: 0,
    },
  });

  const onSubmit = (data: CallLogFormValues) => {
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
    <form id="call-log-create-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="grid grid-cols-2 gap-8 -space-y-4">
        <Controller
          name="type"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel htmlFor="call-type">Call Type</FieldLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <SelectTrigger
                  className="w-full"
                  id="call-type"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Select call type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="inbound">Inbound</SelectItem>
                    <SelectItem value="outbound">Outbound</SelectItem>
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
        <Controller
          name="status"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel htmlFor="call-status">Status</FieldLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <SelectTrigger
                  className="w-full"
                  id="call-status"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="missed">Missed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
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
        <Controller
          name="from"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel htmlFor="call-from">From</FieldLabel>
              <Input
                {...field}
                id="call-from"
                aria-invalid={fieldState.invalid}
                placeholder="e.g. +91 98765 43210"
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
          name="to"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel htmlFor="call-to">To</FieldLabel>
              <Input
                {...field}
                id="call-to"
                aria-invalid={fieldState.invalid}
                placeholder="e.g. +91 90012 34567"
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
          name="duration"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel htmlFor="call-duration">Duration (seconds)</FieldLabel>
              <Input
                {...field}
                id="call-duration"
                type="number"
                min={0}
                aria-invalid={fieldState.invalid}
                placeholder="0"
                autoComplete="off"
                onChange={(e) => field.onChange(e.target.valueAsNumber)}
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
      </FieldGroup>

      <div className="space-x-2 mt-8 flex justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            form.reset();
            setOpen(false);
          }}
        >
          Cancel
        </Button>
        <Button type="submit" form="call-log-create-form">
          Add Call Log
        </Button>
      </div>
    </form>
  );
};
