import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Download, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { columns } from "./columns";
import { UserCreateForm } from "./user-create-form";

import { TableSkeleton } from "@/components/shared/dashboard/skeleton";
import { DataTable } from "@/components/shared/dashboard/data-table";
import { Heading } from "@/components/shared/typography/heading";
import { Description } from "@/components/shared/typography/description";

import { getAllUsers } from "@/api/services/user.service";
import type { User } from "@/types";

const UsersPage = () => {
  const [open, setOpen] = useState(false);

  const { isPending, data: users = [] } = useQuery<User[]>({
    queryKey: ["getAllUsers"],
    queryFn: () => getAllUsers({}).then((response) => response.users),
  });

  if (isPending) return <TableSkeleton />;

  return (
    <>
      <Helmet>
        <title>Users | Dashboard</title>
        <meta name="description" content="Manage users in your CRM" />
      </Helmet>

      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <Heading title="Users" />
            <Description description="Manage your CRM users and their permissions" />
          </div>
          <div className="space-x-2">
            <Button type="button" disabled>
              <Download />
              Export
            </Button>
            <Button type="button" onClick={() => setOpen(true)}>
              <Plus />
              Create
            </Button>
          </div>
        </div>

        <DataTable columns={columns} data={users} placeholder="users" />

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">Create New User</DialogTitle>
            </DialogHeader>

            <UserCreateForm setOpen={setOpen} />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default UsersPage;
