import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { dealFormSchema, type DealFormValues } from "./deal-form-schema";

import { useUpdateDeal } from "@/hooks";

import type { Deal } from "@/types/domain";

interface DealEditFormProps {
  deal: Deal;
}

export const DealEditForm: React.FC<DealEditFormProps> = ({ deal }) => {
  const form = useForm<DealFormValues>({
    resolver: zodResolver(dealFormSchema),
    mode: "onChange",
    defaultValues: {
      name: deal.name,
      value: deal.value,
      probability: deal.probability,
    },
  });

  useEffect(() => {
    form.reset({
      name: deal.name,
      value: deal.value,
      probability: deal.probability,
    });
  }, [deal, form]);

  const { mutate, isPending } = useUpdateDeal();

  const onSubmit = (values: DealFormValues) => {
    mutate(
      { id: deal._id, ...values },
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
    <form id="deal-edit-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="grid grid-cols-2 gap-8 -space-y-4">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel htmlFor="deal-name">Deal Name</FieldLabel>
              <Input
                {...field}
                id="deal-name"
                aria-invalid={fieldState.invalid}
                placeholder="Enter deal name"
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
          name="value"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel htmlFor="deal-value">Deal Value ($)</FieldLabel>
              <Input
                {...field}
                type="number"
                id="deal-value"
                aria-invalid={fieldState.invalid}
                placeholder="Enter deal value"
                autoComplete="off"
                onChange={(e) => field.onChange(e.target.valueAsNumber)}
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
          name="probability"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel htmlFor="deal-probability">
                Deal Probability (%)
              </FieldLabel>
              <Input
                {...field}
                type="number"
                id="deal-probability"
                aria-invalid={fieldState.invalid}
                placeholder="Enter deal probability"
                autoComplete="off"
                min={0}
                max={100}
                onChange={(e) => field.onChange(e.target.valueAsNumber)}
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
      </FieldGroup>

      <div className="space-x-2 mt-8 flex justify-end">
        <Button type="button" variant="outline" onClick={() => form.reset()}>
          Reset
        </Button>
        <Button type="submit" form="deal-edit-form" disabled={isPending}>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};
