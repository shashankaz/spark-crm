import { Controller, type UseFormReturn } from "react-hook-form";
import { LoaderCircle } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import type { EditProfileValues } from "@/pages/profile/profile-form-schema";

interface EditProfileProps {
  editForm: UseFormReturn<EditProfileValues>;
  onEditProfileSubmit: (data: EditProfileValues) => void;
  isProfilePending: boolean;
}

export const EditProfile: React.FC<EditProfileProps> = ({
  editForm,
  onEditProfileSubmit,
  isProfilePending,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Edit Profile</CardTitle>
        <CardDescription>Update your personal information.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="edit-profile-form"
          onSubmit={editForm.handleSubmit(onEditProfileSubmit)}
        >
          <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-8 -space-y-4">
            <Controller
              name="firstName"
              control={editForm.control}
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
              control={editForm.control}
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
              name="mobile"
              control={editForm.control}
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
                      className="text-error text-xs"
                      errors={[fieldState.error]}
                    />
                  )}
                </Field>
              )}
            />
            <div className="sm:col-span-2">
              <Separator className="mb-4" />
              <Button type="submit" disabled={isProfilePending} size="sm">
                {isProfilePending && (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};
