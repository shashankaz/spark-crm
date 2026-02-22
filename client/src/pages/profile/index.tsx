import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { Heading } from "@/components/shared/typography/heading";
import { Description } from "@/components/shared/typography/description";
import { ProfileCard } from "@/components/profile/profile-card";
import { PasswordInput } from "@/components/shared/password-input";

import { editProfileSchema, changePasswordSchema } from "./profile-form-schema";
import type {
  EditProfileValues,
  ChangePasswordValues,
} from "./profile-form-schema";

import { editProfile, changePassword } from "@/api/services/auth.service";

import { useUser } from "@/hooks/use-user";

const ProfilePage = () => {
  const { user, setUser } = useUser();

  const fullName = user
    ? `${user.firstName}${user.lastName ? " " + user.lastName : ""}`
    : "";

  const editForm = useForm<EditProfileValues>({
    resolver: zodResolver(editProfileSchema),
    mode: "onChange",
    values: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      mobile: user?.mobile ?? "",
    },
  });

  const passwordForm = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { mutate: mutateProfile, isPending: isProfilePending } = useMutation({
    mutationFn: editProfile,
    onSuccess: ({ message, user: updatedUser }) => {
      toast.success(message);
      setUser(updatedUser);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: mutatePassword, isPending: isPasswordPending } = useMutation({
    mutationFn: changePassword,
    onSuccess: ({ message }) => {
      toast.success(message);
      passwordForm.reset();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onEditProfileSubmit = (data: EditProfileValues) => {
    mutateProfile({
      firstName: data.firstName,
      lastName: data.lastName,
      mobile: data.mobile || undefined,
    });
  };

  const onChangePasswordSubmit = (data: ChangePasswordValues) => {
    mutatePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  if (!user) return null;

  return (
    <>
      <Helmet>
        <title>Profile | Dashboard</title>
        <meta name="description" content="Your profile settings" />
      </Helmet>

      <div className="space-y-4">
        <div className="border-b pb-4">
          <Heading title="Profile" />
          <Description description="Manage your personal information and account settings." />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          <ProfileCard user={user} />

          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="edit">Edit Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">About</CardTitle>
                  <CardDescription>
                    Your profile information as visible to others.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-muted-foreground mb-0.5">
                        Full Name
                      </p>
                      <p>{fullName || "—"}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground mb-0.5">
                        Email
                      </p>
                      <p>{user.email}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground mb-0.5">
                        Mobile
                      </p>
                      <p>{user.mobile || "—"}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground mb-0.5">
                        Role
                      </p>
                      <p>
                        {user.role === "super_admin"
                          ? "Super Admin"
                          : user.role.charAt(0).toUpperCase() +
                            user.role.slice(1)}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground mb-0.5">
                        Member Since
                      </p>
                      <p>{user.createdAt}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground mb-0.5">
                        Last Updated
                      </p>
                      <p>{user.updatedAt}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="edit">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Edit Profile</CardTitle>
                  <CardDescription>
                    Update your personal information.
                  </CardDescription>
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
                          <Field
                            data-invalid={fieldState.invalid}
                            className="-space-y-2"
                          >
                            <FieldLabel htmlFor="firstName">
                              First Name
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
                                className="text-destructive text-xs"
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
                          <Field
                            data-invalid={fieldState.invalid}
                            className="-space-y-2"
                          >
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
                        name="mobile"
                        control={editForm.control}
                        render={({ field, fieldState }) => (
                          <Field
                            data-invalid={fieldState.invalid}
                            className="-space-y-2"
                          >
                            <FieldLabel htmlFor="mobile">
                              Mobile{" "}
                              <span className="text-muted-foreground text-xs">
                                (optional)
                              </span>
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
                                className="text-destructive text-xs"
                                errors={[fieldState.error]}
                              />
                            )}
                          </Field>
                        )}
                      />
                      <div className="sm:col-span-2">
                        <Separator className="mb-4" />
                        <Button
                          type="submit"
                          disabled={isProfilePending}
                          size="sm"
                        >
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
            </TabsContent>

            <TabsContent value="security">
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
                        <Button
                          type="submit"
                          disabled={isPasswordPending}
                          size="sm"
                        >
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
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
