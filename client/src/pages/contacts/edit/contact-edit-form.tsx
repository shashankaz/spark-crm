import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { contactEditSchema } from "./contact-edit-form-schema";
import type { ContactEditFormValues } from "./contact-edit-form-schema";

import { useUpdateContact } from "@/hooks";

import type { IContact } from "@/types/domain";

interface ContactEditFormProps {
  contact: IContact;
}

export const ContactEditForm: React.FC<ContactEditFormProps> = ({
  contact,
}) => {
  const defaultValues: ContactEditFormValues = {
    firstName: contact.firstName,
    lastName: contact.lastName ?? "",
    email: contact.email,
    phone: contact.phone ?? "",
    jobTitle: contact.jobTitle ?? "",
    department: contact.department ?? "",
    orgName: contact.orgName ?? "",
    linkedinUrl: contact.linkedinUrl ?? "",
    website: contact.website ?? "",
  };

  const form = useForm<ContactEditFormValues>({
    resolver: zodResolver(contactEditSchema),
    mode: "onChange",
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [contact]); // eslint-disable-line react-hooks/exhaustive-deps

  const { mutate, isPending } = useUpdateContact();

  const onSubmit = (data: ContactEditFormValues) => {
    mutate(
      {
        id: contact._id,
        firstName: data.firstName,
        lastName: data.lastName || undefined,
        email: data.email,
        phone: data.phone || undefined,
        jobTitle: data.jobTitle || undefined,
        department: data.department || undefined,
        orgName: data.orgName || undefined,
        linkedinUrl: data.linkedinUrl || undefined,
        website: data.website || undefined,
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
    <form id="contact-edit-form" onSubmit={form.handleSubmit(onSubmit)}>
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
                placeholder="Enter email address"
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
          name="phone"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel htmlFor="phone">Phone</FieldLabel>
              <Input
                {...field}
                id="phone"
                aria-invalid={fieldState.invalid}
                placeholder="Enter phone number"
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
          name="jobTitle"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel htmlFor="jobTitle">Job Title</FieldLabel>
              <Input
                {...field}
                id="jobTitle"
                aria-invalid={fieldState.invalid}
                placeholder="Enter job title"
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
          name="department"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel htmlFor="department">Department</FieldLabel>
              <Input
                {...field}
                id="department"
                aria-invalid={fieldState.invalid}
                placeholder="Enter department"
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
          name="orgName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel htmlFor="orgName">Organization</FieldLabel>
              <Input
                {...field}
                id="orgName"
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
          name="linkedinUrl"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel htmlFor="linkedinUrl">LinkedIn URL</FieldLabel>
              <Input
                {...field}
                id="linkedinUrl"
                aria-invalid={fieldState.invalid}
                placeholder="https://linkedin.com/in/username"
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
                placeholder="https://example.com"
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
          disabled={isPending}
          onClick={() => form.reset(defaultValues)}
        >
          Reset
        </Button>
        <Button type="submit" form="contact-edit-form" disabled={isPending}>
          {isPending ? (
            <>
              <LoaderCircle className="animate-spin mr-2 h-4 w-4" />
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
