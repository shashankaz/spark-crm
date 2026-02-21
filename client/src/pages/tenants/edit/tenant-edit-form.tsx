import { useEffect } from "react";
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
import { Separator } from "@/components/ui/separator";

import { countriesFlag } from "@/utils/countries/countries-flag";

import { tenantFormSchema } from "../tenant-form-schema";
import type { TenantFormValues } from "../tenant-form-schema";

import type { Tenant } from "@/types";

interface TenantEditFormProps {
  tenant: Tenant;
}

export const TenantEditForm: React.FC<TenantEditFormProps> = ({ tenant }) => {
  const form = useForm<TenantFormValues>({
    resolver: zodResolver(tenantFormSchema),
    mode: "onChange",
    defaultValues: {
      name: tenant.name,
      gstNumber: tenant.gstNumber ?? "",
      panNumber: tenant.panNumber ?? "",
      email: tenant.email,
      mobile: tenant.mobile,
      address: {
        line1: tenant.address.line1,
        line2: tenant.address.line2 ?? "",
        city: tenant.address.city,
        state: tenant.address.state,
        postalCode: tenant.address.postalCode,
        country: tenant.address.country,
      },
      plan: tenant.plan,
    },
  });

  useEffect(() => {
    form.reset({
      name: tenant.name,
      gstNumber: tenant.gstNumber ?? "",
      panNumber: tenant.panNumber ?? "",
      email: tenant.email,
      mobile: tenant.mobile,
      address: {
        line1: tenant.address.line1,
        line2: tenant.address.line2 ?? "",
        city: tenant.address.city,
        state: tenant.address.state,
        postalCode: tenant.address.postalCode,
        country: tenant.address.country,
      },
      plan: tenant.plan,
    });
  }, [tenant, form]);

  const onSubmit = (data: TenantFormValues) => {
    try {
      console.log("Tenant updated:", data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form id="tenant-edit-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="grid grid-cols-2 md:grid-cols-3 gap-8 -space-y-4">
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
                placeholder="Enter tenant name"
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
          name="plan"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel htmlFor="plan">Plan</FieldLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <SelectTrigger
                  className="w-full"
                  id="plan"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
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
          name="gstNumber"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel htmlFor="gstNumber">
                GST Number{" "}
                <span className="text-muted-foreground text-xs">
                  (optional)
                </span>
              </FieldLabel>
              <Input
                {...field}
                id="gstNumber"
                aria-invalid={fieldState.invalid}
                placeholder="Enter GST number"
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
          name="panNumber"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel htmlFor="panNumber">
                PAN Number{" "}
                <span className="text-muted-foreground text-xs">
                  (optional)
                </span>
              </FieldLabel>
              <Input
                {...field}
                id="panNumber"
                aria-invalid={fieldState.invalid}
                placeholder="Enter PAN number"
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

        <div className="col-span-2 md:col-span-3">
          <Separator />
          <p className="text-sm font-medium mt-3 mb-1">Address</p>
        </div>

        <Controller
          name="address.line1"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel htmlFor="address.line1">Line 1</FieldLabel>
              <Input
                {...field}
                id="address.line1"
                aria-invalid={fieldState.invalid}
                placeholder="Street address"
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
          name="address.line2"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel htmlFor="address.line2">
                Line 2{" "}
                <span className="text-muted-foreground text-xs">
                  (optional)
                </span>
              </FieldLabel>
              <Input
                {...field}
                id="address.line2"
                aria-invalid={fieldState.invalid}
                placeholder="Apt, suite, floor, etc."
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
          name="address.city"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel htmlFor="address.city">City</FieldLabel>
              <Input
                {...field}
                id="address.city"
                aria-invalid={fieldState.invalid}
                placeholder="Enter city"
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
          name="address.state"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel htmlFor="address.state">State</FieldLabel>
              <Input
                {...field}
                id="address.state"
                aria-invalid={fieldState.invalid}
                placeholder="Enter state"
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
          name="address.postalCode"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel htmlFor="address.postalCode">Postal Code</FieldLabel>
              <Input
                {...field}
                id="address.postalCode"
                aria-invalid={fieldState.invalid}
                placeholder="Enter postal code"
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
          name="address.country"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel htmlFor="address.country">Country</FieldLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <SelectTrigger
                  className="w-full"
                  id="address.country"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {countriesFlag.map((country) => (
                      <SelectItem
                        key={country.label.toLocaleLowerCase()}
                        value={country.label}
                      >
                        <img
                          src={country.flag}
                          alt={country.label}
                          className="w-6 h-4 mr-2 inline-block"
                        />
                        {country.label}
                      </SelectItem>
                    ))}
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
      </FieldGroup>

      <div className="space-x-2 mt-6 flex justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            form.reset({
              name: tenant.name,
              gstNumber: tenant.gstNumber ?? "",
              panNumber: tenant.panNumber ?? "",
              email: tenant.email,
              mobile: tenant.mobile,
              address: {
                line1: tenant.address.line1,
                line2: tenant.address.line2 ?? "",
                city: tenant.address.city,
                state: tenant.address.state,
                postalCode: tenant.address.postalCode,
                country: tenant.address.country,
              },
              plan: tenant.plan,
            })
          }
        >
          Reset
        </Button>
        <Button type="submit" form="tenant-edit-form">
          Save Changes
        </Button>
      </div>
    </form>
  );
};
