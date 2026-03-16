import { useParams, Link } from "react-router";
import { Helmet } from "react-helmet-async";
import { KeyRound, LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { UserEditForm } from "./user-edit-form";
import { Heading } from "@/components/shared/typography/heading";
import { Description } from "@/components/shared/typography/description";

import { useUserById, useGeneratePassword } from "@/hooks";

const UsersEditPage = () => {
  const { userId } = useParams<{ userId: string }>();

  const { data, isPending } = useUserById({ id: userId! });
  const user = data?.user;

  const { mutate: generatePwd, isPending: isGenerating } =
    useGeneratePassword();

  const handleGeneratePassword = () => {
    generatePwd(
      { id: userId! },
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

  if (isPending) return null;

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-muted-foreground">User not found.</p>
        <Button asChild variant="outline">
          <Link to="/dashboard/users">Back to Users</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Edit {user.firstName} | Users</title>
        <meta name="description" content={`Edit user ${user.firstName}`} />
      </Helmet>

      <div className="space-y-6">
        <div className="border-b pb-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Heading title={user.firstName} />
                <Badge
                  variant={user.role === "admin" ? "default" : "secondary"}
                >
                  {user.role}
                </Badge>
              </div>
              <Description description={user.email} />
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <LoaderCircle className="animate-spin mr-2 h-4 w-4" />
                  ) : (
                    <KeyRound className="mr-2 h-4 w-4" />
                  )}
                  Generate Password
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Generate new password?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will generate a secure random password, revoke all
                    active sessions for{" "}
                    <strong>{user.firstName}</strong>, and email the new
                    password to <strong>{user.email}</strong>. They will need
                    to log in again on all devices.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleGeneratePassword}>
                    Generate &amp; Send
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <UserEditForm user={user} />
      </div>
    </>
  );
};

export default UsersEditPage;
