import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { contactFormSchema } from "./contact-form-schema";
import type { ContactFormValues } from "./contact-form-schema";

export const ContactForm = () => {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    mode: "onChange",
    defaultValues: {
      name: undefined,
      email: undefined,
      company: undefined,
      message: undefined,
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    try {
      console.log("Contact form submitted:", data);
    } catch (error) {
      console.error(error);
    } finally {
      form.reset();
    }
  };

  return (
    <form id="contact-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="-space-y-2">
                <FieldLabel
                  htmlFor="name"
                  className="text-sm font-medium text-foreground"
                >
                  Name
                </FieldLabel>
                <Input
                  {...field}
                  id="name"
                  aria-invalid={fieldState.invalid}
                  placeholder="Jane Smith"
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
                <FieldLabel
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                >
                  Email
                </FieldLabel>
                <Input
                  {...field}
                  id="email"
                  type="email"
                  aria-invalid={fieldState.invalid}
                  placeholder="jane@company.com"
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
        </div>

        <Controller
          name="company"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel
                htmlFor="company"
                className="text-sm font-medium text-foreground"
              >
                Company{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </FieldLabel>
              <Input
                {...field}
                id="company"
                aria-invalid={fieldState.invalid}
                placeholder="Acme Inc."
                autoComplete="off"
              />
            </Field>
          )}
        />

        <Controller
          name="message"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel
                htmlFor="message"
                className="text-sm font-medium text-foreground"
              >
                Message
              </FieldLabel>
              <Textarea
                {...field}
                id="message"
                aria-invalid={fieldState.invalid}
                placeholder="Tell us about your team size, current tools, and what you'd like to achieve with Spark..."
                className="resize-none h-40"
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

      <Button
        type="submit"
        form="contact-form"
        size="lg"
        className="w-full rounded-full mt-6"
        disabled={!form.formState.isValid}
      >
        Send message
      </Button>
    </form>
  );
};
