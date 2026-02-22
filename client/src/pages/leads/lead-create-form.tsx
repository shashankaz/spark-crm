import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { v7 as uuidv7 } from "uuid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

import { leadFormSchema } from "./lead-form-schema";
import type { LeadFormValues } from "./lead-form-schema";

import { createLead } from "@/api/services/lead.service";
import { getAllOrganizations } from "@/api/services/organization.service";

import { useUser } from "@/hooks/use-user";

interface LeadCreateFormProps {
  setOpen: (open: boolean) => void;
}

export const LeadCreateForm: React.FC<LeadCreateFormProps> = ({ setOpen }) => {
  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    mode: "onChange",
    defaultValues: {
      firstName: undefined,
      lastName: undefined,
      email: undefined,
      mobile: undefined,
      gender: undefined,
      organization: undefined,
      source: undefined,
    },
  });

  const { user } = useUser();

  const queryClient = useQueryClient();

  const { data: organizationsData } = useQuery({
    queryKey: ["fetchOrganizations"],
    queryFn: () => getAllOrganizations({}),
  });

  const organizations = organizationsData?.organizations ?? [];

  const { mutate: submitLead } = useMutation({
    mutationFn: (data: LeadFormValues) => {
      const org = organizations.find((o) => o._id === data.organization);
      return createLead({
        idempotentId: uuidv7(),
        userId: user!._id,
        orgId: data.organization,
        orgName: org?.name ?? "",
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        mobile: data.mobile,
        gender: data.gender,
        source: data.source,
      });
    },
    onSuccess: ({ message }) => {
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ["fetchLeads"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error((error as Error).message);
    },
    onSettled: () => {
      form.reset();
      setOpen(false);
    },
  });

  if (!user) return null;

  const onSubmit = (data: LeadFormValues) => {
    submitLead(data);
  };

  return (
    <form id="lead-create-form" onSubmit={form.handleSubmit(onSubmit)}>
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

      <div className="space-x-2 mt-4 flex justify-end">
        <Button type="button" variant="outline" onClick={() => form.reset()}>
          Reset
        </Button>
        <Button type="submit" form="lead-create-form">
          Submit
        </Button>
      </div>
    </form>
  );
};
