import { useState, useMemo } from "react";
import { debounce } from "lodash";
import { Helmet } from "react-helmet-async";
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

import { useLeads } from "@/hooks/use-lead";

import { exportLeadsToExcel } from "@/utils/export/lead-excel";

import type { Lead } from "@/types";

const LeadPage = () => {
  const [open, setOpen] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<Lead[]>([]);

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const handleSearchChange = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearch(value);
      }, 500),
    [],
  );

  const { isPending, data } = useLeads({ search: debouncedSearch });
  const leads = data?.leads ?? [];

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
            <Button
              type="button"
              onClick={() => exportLeadsToExcel(selectedLeads)}
              disabled={selectedLeads.length === 0}
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
          data={leads}
          placeholder="leads"
          search={searchInput}
          onSearchChange={(value) => {
            setSearchInput(value);
            handleSearchChange(value);
          }}
          onSelectionChange={(rows) => setSelectedLeads(rows as Lead[])}
        />

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
