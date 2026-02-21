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
import { LeadCreateForm } from "./lead-create-form";

import type { Lead } from "@/types";
import { getAllLeads } from "@/api/services/lead.service";

const LeadPage = () => {
  const [open, setOpen] = useState(false);

  const { isPending, data: leads = [] } = useQuery<Lead[]>({
    queryKey: ["fetchLeads"],
    queryFn: () => getAllLeads({}).then((response) => response.leads),
  });

  if (isPending) return <TableSkeleton />;

  return (
    <>
      <Helmet>
        <title>Leads | Dashboard</title>
        <meta name="description" content="Manage leads in your CRM" />
      </Helmet>

      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <Heading title="Leads" />
            <Description description="Manage your CRM leads and their status" />
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

        <DataTable columns={columns} data={leads} placeholder="leads" />

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-2xl">Create New Lead</DialogTitle>
            </DialogHeader>

            <LeadCreateForm setOpen={setOpen} />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default LeadPage;
