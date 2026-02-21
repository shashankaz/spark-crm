import { useState } from "react";
import { useParams, Link } from "react-router";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Heading } from "@/components/shared/typography/heading";
import { Description } from "@/components/shared/typography/description";
import { DataTable } from "@/components/shared/dashboard/data-table";

import { columns as userColumns } from "@/pages/users/columns";
import { UserCreateForm } from "@/pages/users/user-create-form";

import type { Tenant } from "@/types";
import type { User } from "@/types";

import { TenantEditForm } from "./tenant-edit-form";
import { getTenantById } from "@/api/services/tenant.service";

interface TenantDetailsResponse {
  tenant: Tenant;
  usersCount: number;
  users: User[];
}

const TenantsEditPage = () => {
  const { tenantId } = useParams<{ tenantId: string }>();
  const [userDialogOpen, setUserDialogOpen] = useState(false);

  const { isPending, data } = useQuery<TenantDetailsResponse>({
    queryKey: ["getTenantById", tenantId],
    queryFn: () =>
      getTenantById({ id: tenantId! }).then((response) => response),
    enabled: !!tenantId,
  });

  if (isPending) return null;

  if (!data) return null;

  const tenant = data?.tenant;
  const users = data?.users ?? [];
  const usersCount = data?.usersCount ?? 0;

  // if (!tenant) {
  //   return (
  //     <div className="flex flex-col items-center justify-center h-64 gap-4">
  //       <p className="text-muted-foreground">Tenant not found.</p>
  //       <Button asChild variant="outline">
  //         <Link to="/admin/tenants">Back to Tenants</Link>
  //       </Button>
  //     </div>
  //   );
  // }

  return (
    <>
      <Helmet>
        <title>Edit {tenant.name} | Admin</title>
        <meta name="description" content={`Edit tenant ${tenant.name}`} />
      </Helmet>

      <div className="space-y-6">
        <div className="border-b pb-4">
          <Heading title={tenant.name} />
          <Description description="Manage tenant details and users" />
        </div>

        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="users">
              Users
              <span className="ml-1.5 rounded-full bg-muted text-muted-foreground text-xs px-1.5 py-0.5">
                {usersCount}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-6">
            <TenantEditForm tenant={tenant} />
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Users</h2>
                  <p className="text-muted-foreground text-sm">
                    Manage users belonging to {tenant.name}
                  </p>
                </div>
                <Button type="button" onClick={() => setUserDialogOpen(true)}>
                  <Plus />
                  Add User
                </Button>
              </div>

              <DataTable
                columns={userColumns}
                data={users}
                placeholder="users"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Add User</DialogTitle>
          </DialogHeader>
          <UserCreateForm setOpen={setUserDialogOpen} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TenantsEditPage;
