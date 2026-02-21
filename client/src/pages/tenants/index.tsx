import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Download, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { Heading } from "@/components/shared/typography/heading";
import { Description } from "@/components/shared/typography/description";
import { TableSkeleton } from "@/components/shared/dashboard/skeleton";
import { DataTable } from "@/components/shared/dashboard/data-table";

import { columns } from "./columns";
import { TenantCreateForm } from "./tenant-create-form";

import { getAllTenants } from "@/api/services/tenant.service";

import type { Tenant } from "@/types";

const TenantsPage = () => {
  const [open, setOpen] = useState(false);

  const { isPending, data: tenants = [] } = useQuery<Tenant[]>({
    queryKey: ["getAllTenants"],
    queryFn: () => getAllTenants().then((response) => response.tenants),
  });

  if (isPending) return <TableSkeleton />;

  return (
    <>
      <Helmet>
        <title>Tenants | Dashboard</title>
        <meta name="description" content="Manage tenants in your CRM" />
      </Helmet>

      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <Heading title="Tenants" />
            <Description description="Manage your CRM tenants and their subscriptions" />
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

        <DataTable columns={columns} data={tenants} placeholder="tenants" />

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">Create New Tenant</DialogTitle>
            </DialogHeader>

            <TenantCreateForm setOpen={setOpen} />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default TenantsPage;
