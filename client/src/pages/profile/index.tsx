import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Heading } from "@/components/shared/typography/heading";
import { Description } from "@/components/shared/typography/description";
import { ProfileCard } from "@/components/profile/profile-card";
import { EditProfile } from "@/components/profile/edit-profile";
import { ChangePassword } from "@/components/profile/change-password";

import { editProfileSchema, changePasswordSchema } from "./profile-form-schema";
import type {
  EditProfileValues,
  ChangePasswordValues,
} from "./profile-form-schema";

import { useUser } from "@/hooks/use-user";
import { useChangePassword, useEditProfile } from "@/hooks/use-auth";

const ProfilePage = () => {
  const { user } = useUser();

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

  const { mutate: mutatePassword, isPending: isPasswordPending } =
    useChangePassword();
  const { mutate: mutateProfile, isPending: isProfilePending } =
    useEditProfile();

  const onChangePasswordSubmit = (data: ChangePasswordValues) => {
    mutatePassword(
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      },
      {
        onSuccess: ({ message }) => {
          toast.success(message);
        },
        onError: ({ message }) => {
          toast.error(message);
        },
        onSettled: () => {
          passwordForm.reset();
        },
      },
    );
  };

  const onEditProfileSubmit = (data: EditProfileValues) => {
    mutateProfile(
      {
        firstName: data.firstName,
        lastName: data.lastName,
        mobile: data.mobile || undefined,
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
              <EditProfile
                editForm={editForm}
                onEditProfileSubmit={onEditProfileSubmit}
                isProfilePending={isProfilePending}
              />
            </TabsContent>

            <TabsContent value="security">
              <ChangePassword
                passwordForm={passwordForm}
                onChangePasswordSubmit={onChangePasswordSubmit}
                isPasswordPending={isPasswordPending}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
