import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import debounce from "lodash/debounce";

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

import { tenantFormSchema } from "./tenant-form-schema";
import type { TenantFormValues } from "./tenant-form-schema";

import { useCreateTenant, useCheckSlugAvailability } from "@/hooks";

interface TenantCreateFormProps {
  setOpen: (open: boolean) => void;
}

export const TenantCreateForm: React.FC<TenantCreateFormProps> = ({
  setOpen,
}) => {
  const [slugStatus, setSlugStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");

  const form = useForm<TenantFormValues>({
    resolver: zodResolver(tenantFormSchema),
    mode: "onChange",
    defaultValues: {
      name: undefined,
      slug: undefined,
      gstNumber: undefined,
      panNumber: undefined,
      email: undefined,
      mobile: undefined,
      address: {
        line1: undefined,
        line2: undefined,
        city: undefined,
        state: undefined,
        postalCode: undefined,
        country: undefined,
      },
      plan: undefined,
    },
  });

  const { mutate: checkSlugAvailability } = useCheckSlugAvailability();

  const debouncedCheckSlug = useMemo(
    () =>
      debounce((slug: string) => {
        checkSlugAvailability(
          { slug },
          {
            onSuccess: (result) => {
              setSlugStatus(result.isAvailable ? "available" : "taken");
              if (!result.isAvailable) {
                form.setError("slug", {
                  message: "This slug is already taken",
                });
              } else {
                form.clearErrors("slug");
              }
            },
            onError: () => setSlugStatus("idle"),
          },
        );
      }, 500),
    [checkSlugAvailability, form],
  );

  const checkSlug = (slug: string) => {
    if (!slug || slug.length < 2) {
      debouncedCheckSlug.cancel();
      setSlugStatus("idle");
      return;
    }

    const isValidPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
    if (!isValidPattern) {
      debouncedCheckSlug.cancel();
      setSlugStatus("idle");
      return;
    }

    setSlugStatus("checking");
    debouncedCheckSlug(slug);
  };

  const { mutate, isPending } = useCreateTenant();

  const onSubmit = (data: TenantFormValues) => {
    mutate(data, {
      onSuccess: ({ message }) => {
        toast.success(message);
        form.reset();
        setOpen(false);
      },
      onError: ({ message }) => {
        toast.error(message);
      },
      onSettled: () => {
        setSlugStatus("idle");
      },
    });
  };

  return (
    <form id="tenant-create-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="grid grid-cols-2 md:grid-cols-3 gap-8 -space-y-4">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel htmlFor="name">
                Name <span className="text-error">*</span>
              </FieldLabel>
              <Input
                {...field}
                id="name"
                aria-invalid={fieldState.invalid}
                placeholder="Enter tenant name"
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
          name="slug"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid || slugStatus === "taken"}
              className="-space-y-2"
            >
              <FieldLabel htmlFor="slug">
                Slug <span className="text-error">*</span>
              </FieldLabel>
              <div className="relative">
                <Input
                  {...field}
                  id="slug"
                  aria-invalid={fieldState.invalid || slugStatus === "taken"}
                  placeholder="Enter tenant slug"
                  autoComplete="off"
                  onChange={(e) => {
                    field.onChange(e);
                    checkSlug(e.target.value);
                  }}
                />
                {slugStatus === "checking" && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2">
                    <LoaderCircle className="h-4 w-4 animate-spin text-muted-foreground" />
                  </span>
                )}
              </div>
              {slugStatus === "available" && !fieldState.invalid && (
                <p className="text-xs text-green-600">Slug is available</p>
              )}
              {slugStatus === "taken" && (
                <p className="text-xs text-error">This slug is already taken</p>
              )}
              {fieldState.invalid && slugStatus !== "taken" && (
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
          name="plan"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel htmlFor="plan">
                Plan <span className="text-error">*</span>
              </FieldLabel>
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
                  className="text-error text-xs"
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
              <FieldLabel htmlFor="gstNumber">GST Number</FieldLabel>
              <Input
                {...field}
                id="gstNumber"
                aria-invalid={fieldState.invalid}
                placeholder="Enter GST number"
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
          name="panNumber"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel htmlFor="panNumber">PAN Number</FieldLabel>
              <Input
                {...field}
                id="panNumber"
                aria-invalid={fieldState.invalid}
                placeholder="Enter PAN number"
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

        <div className="col-span-2 md:col-span-3">
          <Separator />
          <p className="text-sm font-medium mt-3 mb-1">Address</p>
        </div>

        <Controller
          name="address.line1"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel htmlFor="address.line1">
                Line 1 <span className="text-error">*</span>
              </FieldLabel>
              <Input
                {...field}
                id="address.line1"
                aria-invalid={fieldState.invalid}
                placeholder="Street address"
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
          name="address.line2"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel htmlFor="address.line2">Line 2</FieldLabel>
              <Input
                {...field}
                id="address.line2"
                aria-invalid={fieldState.invalid}
                placeholder="Apt, suite, floor, etc."
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
          name="address.city"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel htmlFor="address.city">
                City <span className="text-error">*</span>
              </FieldLabel>
              <Input
                {...field}
                id="address.city"
                aria-invalid={fieldState.invalid}
                placeholder="Enter city"
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
          name="address.state"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel htmlFor="address.state">
                State <span className="text-error">*</span>
              </FieldLabel>
              <Input
                {...field}
                id="address.state"
                aria-invalid={fieldState.invalid}
                placeholder="Enter state"
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
          name="address.postalCode"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel htmlFor="address.postalCode">
                Postal Code <span className="text-error">*</span>
              </FieldLabel>
              <Input
                {...field}
                id="address.postalCode"
                aria-invalid={fieldState.invalid}
                placeholder="Enter postal code"
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
          name="address.country"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel htmlFor="address.country">
                Country <span className="text-error">*</span>
              </FieldLabel>
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
                  className="text-error text-xs"
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
          disabled={isPending}
          onClick={() => {
            form.reset();
            setSlugStatus("idle");
          }}
        >
          Reset
        </Button>
        <Button
          type="submit"
          form="tenant-create-form"
          disabled={
            !form.formState.isValid ||
            isPending ||
            slugStatus === "taken" ||
            slugStatus === "checking"
          }
        >
          {isPending ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </div>
    </form>
  );
};
