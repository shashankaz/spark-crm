import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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

import { organizationFormSchema } from "../organization-form-schema";
import type { OrganizationFormValues } from "../organization-form-schema";

import { updateOrganizationById } from "@/api/services/organization.service";

import { countriesFlag } from "@/utils/countries/countries-flag";

import type { Organization } from "@/types";

interface OrganizationEditFormProps {
  organization: Organization;
}

export const OrganizationEditForm: React.FC<OrganizationEditFormProps> = ({
  organization,
}) => {
  const queryClient = useQueryClient();

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationFormSchema),
    mode: "onChange",
    defaultValues: {
      name: organization.name,
      industry: organization.industry as OrganizationFormValues["industry"],
      size: organization.size as OrganizationFormValues["size"],
      country: organization.country as OrganizationFormValues["country"],
      email: organization.email ?? undefined,
      mobile: organization.mobile ?? undefined,
      website: organization.website ?? undefined,
    },
  });

  useEffect(() => {
    form.reset({
      name: organization.name,
      industry: organization.industry as OrganizationFormValues["industry"],
      size: organization.size as OrganizationFormValues["size"],
      country: organization.country as OrganizationFormValues["country"],
      email: organization.email ?? undefined,
      mobile: organization.mobile ?? undefined,
      website: organization.website ?? undefined,
    });
  }, [organization, form]);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: OrganizationFormValues) =>
      updateOrganizationById({ id: organization._id, ...data }),
    onSuccess: ({ message }) => {
      toast.success(message);
      queryClient.invalidateQueries({
        queryKey: ["fetchOrganization", organization._id],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: OrganizationFormValues) => {
    mutate(data);
  };

  return (
    <form id="organization-edit-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="grid grid-cols-2 gap-8 -space-y-4">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel htmlFor="name">Organization Name</FieldLabel>
              <Input
                {...field}
                id="name"
                aria-invalid={fieldState.invalid}
                placeholder="Enter organization name"
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
          name="industry"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel htmlFor="industry">Industry</FieldLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <SelectTrigger
                  className="w-full"
                  id="industry"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="real estate">Real Estate</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
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
          name="size"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel htmlFor="size">Size</FieldLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <SelectTrigger
                  className="w-full"
                  id="size"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Select organization size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="smb">SMB</SelectItem>
                    <SelectItem value="mid-market">Mid-Market</SelectItem>
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
          name="country"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel htmlFor="country">Country</FieldLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <SelectTrigger
                  className="w-full"
                  id="country"
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
                placeholder="Enter mobile number"
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
          name="website"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel htmlFor="website">Website</FieldLabel>
              <Input
                {...field}
                id="website"
                aria-invalid={fieldState.invalid}
                placeholder="Enter website URL"
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
      </FieldGroup>

      <div className="space-x-2 mt-6 flex justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            form.reset({
              name: organization.name,
              industry:
                organization.industry as OrganizationFormValues["industry"],
              size: organization.size as OrganizationFormValues["size"],
              country:
                organization.country as OrganizationFormValues["country"],
              email: organization.email ?? "",
              mobile: organization.mobile ?? "",
              website: organization.website ?? "",
            })
          }
        >
          Reset
        </Button>
        <Button
          type="submit"
          form="organization-edit-form"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            "Save"
          )}
        </Button>
      </div>
    </form>
  );
};
