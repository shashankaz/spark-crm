import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateLeadById } from "@/api/services/lead.service";

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

import { leadFormSchema } from "../lead-form-schema";
import type { LeadFormValues } from "../lead-form-schema";

export interface LeadEditData {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  mobile: string;
  gender: "Male" | "Female" | "Other";
  organization: string;
  source:
    | "Website"
    | "Facebook Ads"
    | "Google Ads"
    | "Instagram"
    | "LinkedIn"
    | "Email Marketing"
    | "Referral"
    | "Cold Call"
    | "WhatsApp"
    | "Other";
}

interface LeadEditFormProps {
  lead: LeadEditData;
  organizations: { _id: string; name: string }[];
}

export const LeadEditForm: React.FC<LeadEditFormProps> = ({
  lead,
  organizations,
}) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: LeadFormValues) =>
      updateLeadById({
        id: lead.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        mobile: data.mobile,
        gender: data.gender,
        orgId: data.organization,
        source: data.source,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getLeadById", lead.id] });
    },
  });

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    mode: "onChange",
    defaultValues: {
      firstName: lead.firstName,
      lastName: lead.lastName ?? "",
      email: lead.email,
      mobile: lead.mobile,
      gender: lead.gender,
      organization: lead.organization,
      source: lead.source,
    },
  });

  useEffect(() => {
    form.reset({
      firstName: lead.firstName,
      lastName: lead.lastName ?? "",
      email: lead.email,
      mobile: lead.mobile,
      gender: lead.gender,
      organization: lead.organization,
      source: lead.source,
    });
  }, [lead, form]);

  const onSubmit = (data: LeadFormValues) => {
    mutate(data);
  };

  return (
    <form id="lead-edit-form" onSubmit={form.handleSubmit(onSubmit)}>
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
                  className="text-destructive text-xs"
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
                placeholder="Enter mobile number"
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
          name="gender"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel htmlFor="gender">Gender</FieldLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <SelectTrigger
                  className="w-full"
                  id="gender"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
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
          name="organization"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel htmlFor="organization">Organization</FieldLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <SelectTrigger
                  className="w-full"
                  id="organization"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Select organization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {organizations.map((org) => (
                      <SelectItem key={org._id} value={org._id}>
                        {org.name}
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
        <Controller
          name="source"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel htmlFor="source">Source</FieldLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <SelectTrigger
                  className="w-full"
                  id="source"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="facebook ads">Facebook Ads</SelectItem>
                    <SelectItem value="google ads">Google Ads</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="email marketing">
                      Email Marketing
                    </SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="cold call">Cold Call</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
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

      <div className="space-x-2 mt-8 flex justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            form.reset({
              firstName: lead.firstName,
              lastName: lead.lastName ?? "",
              email: lead.email,
              mobile: lead.mobile,
              gender: lead.gender,
              organization: lead.organization,
              source: lead.source,
            })
          }
        >
          Reset
        </Button>
        <Button type="submit" form="lead-edit-form" disabled={isPending}>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};
