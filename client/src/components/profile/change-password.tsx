import type { UseFormReturn } from "react-hook-form";
import { LoaderCircle } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FieldGroup } from "@/components/ui/field";

import { PasswordInput } from "@/components/shared/password-input";

import type { ChangePasswordValues } from "@/pages/profile/profile-form-schema";

interface ChangePasswordProps {
  passwordForm: UseFormReturn<ChangePasswordValues>;
  onChangePasswordSubmit: (data: ChangePasswordValues) => void;
  isPasswordPending: boolean;
}

export const ChangePassword: React.FC<ChangePasswordProps> = ({
  passwordForm,
  onChangePasswordSubmit,
  isPasswordPending,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Change Password</CardTitle>
        <CardDescription>
          Update your password to keep your account secure.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="change-password-form"
          onSubmit={passwordForm.handleSubmit(onChangePasswordSubmit)}
        >
          <FieldGroup className="max-w-sm -space-y-4">
            <PasswordInput
              form={passwordForm}
              name="currentPassword"
              placeholder="Enter current password"
              label="Current Password"
            />
            <PasswordInput
              form={passwordForm}
              name="newPassword"
              placeholder="Enter new password"
              label="New Password"
            />
            <PasswordInput
              form={passwordForm}
              name="confirmPassword"
              placeholder="Confirm new password"
              label="Confirm New Password"
            />
            <div>
              <Separator className="mb-4" />
              <Button type="submit" disabled={isPasswordPending} size="sm">
                {isPasswordPending && (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                )}
                Update Password
              </Button>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};
