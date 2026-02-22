import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { Download, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { DataTable } from "@/components/shared/dashboard/data-table";
import { TableSkeleton } from "@/components/shared/dashboard/skeleton";
import { Heading } from "@/components/shared/typography/heading";
import { Description } from "@/components/shared/typography/description";

import { columns } from "./columns";
import { OrganizationCreateForm } from "./organization-create-form";

import { getAllOrganizations } from "@/api/services/organization.service";

import { exportOrganizationsToExcel } from "@/utils/export/organization-excel";

import type { Organization } from "@/types";

const OrganizationsPage = () => {
  const [open, setOpen] = useState(false);
  const [selectedOrganizations, setSelectedOrganizations] = useState<
    Organization[]
  >([]);

  const { isPending, data: organizations = [] } = useQuery<Organization[]>({
    queryKey: ["fetchOrganizations"],
    queryFn: () =>
      getAllOrganizations({}).then((response) => response.organizations),
  });

  if (isPending) return <TableSkeleton />;

  return (
    <>
      <Helmet>
        <title>Organizations | Dashboard</title>
        <meta name="description" content="Manage organizations in your CRM" />
      </Helmet>

      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <Heading title="Organizations" />
            <Description description="Manage your CRM organizations and their details" />
          </div>
          <div className="space-x-2">
            <Button
              type="button"
              onClick={() => exportOrganizationsToExcel(selectedOrganizations)}
              disabled={selectedOrganizations.length === 0}
            >
              <Download />
              Export
            </Button>
            <Button type="button" onClick={() => setOpen(true)}>
              <Plus />
              Create
            </Button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={organizations}
          placeholder="organizations"
          onSelectionChange={(rows) =>
            setSelectedOrganizations(rows as Organization[])
          }
        />

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-2xl">
                Create New Organization
              </DialogTitle>
            </DialogHeader>

            <OrganizationCreateForm setOpen={setOpen} />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default OrganizationsPage;
