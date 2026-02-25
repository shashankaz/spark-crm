import { useParams, Link } from "react-router";
import { Helmet } from "react-helmet-async";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { UserEditForm } from "./user-edit-form";
import { Heading } from "@/components/shared/typography/heading";
import { Description } from "@/components/shared/typography/description";

import { useUserById } from "@/hooks";

const UsersEditPage = () => {
  const { userId } = useParams<{ userId: string }>();

  const { data, isPending } = useUserById({ id: userId! });
  const user = data?.user;

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
          </div>
        </div>

        <UserEditForm user={user} />
      </div>
    </>
  );
};

export default UsersEditPage;
