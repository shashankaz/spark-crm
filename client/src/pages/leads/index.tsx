import { useState, useMemo } from "react";
import { debounce } from "lodash";
import { Helmet } from "react-helmet-async";
import { useHotkey } from "@tanstack/react-hotkeys";
import { Download, Plus, Upload } from "lucide-react";

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
import { LeadImportModal } from "./lead-import-modal";
import {
  LeadFilterModal,
  defaultFilters,
  type LeadFilters,
} from "./lead-filter-modal";
import { LeadExportModal } from "./lead-export-modal";

import { useLeads, useUser } from "@/hooks";

import type { Lead } from "@/types/domain";

const LeadPage = () => {
  const [open, setOpen] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<Lead[]>([]);

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState<LeadFilters>(defaultFilters);

  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  const { user } = useUser();

  const handleSearchChange = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearch(value);
      }, 500),
    [],
  );

  const { isPending, data } = useLeads({ search: debouncedSearch });
  const leads = data?.leads ?? [];

  useHotkey("Mod+L", () => {
    setOpen(true);
  });

  const orgNames = useMemo(
    () =>
      Array.from(
        new Set(leads.map((l) => l.orgName).filter(Boolean) as string[]),
      ).sort(),
    [leads],
  );

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      if (filters.assignment === "assigned" && lead.userId !== user?._id) {
        return false;
      }

      if (filters.orgName === "__unassigned__") {
        if (lead.orgName) return false;
      } else if (filters.orgName && lead.orgName !== filters.orgName) {
        return false;
      }

      if (filters.scoreRange === "low" && lead.score > 30) return false;
      if (
        filters.scoreRange === "medium" &&
        (lead.score < 31 || lead.score > 60)
      )
        return false;
      if (filters.scoreRange === "high" && lead.score < 61) return false;

      return true;
    });
  }, [leads, filters, user]);

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
          <div className="space-x-2 flex items-center">
            <LeadFilterModal
              filters={filters}
              orgNames={orgNames}
              onChange={setFilters}
            />
            <Button
              type="button"
              onClick={() => setExportDialogOpen(true)}
              disabled={selectedLeads.length === 0}
            >
              <Download />
              Export
            </Button>
            <Button
              type="button"
              onClick={() => setImportDialogOpen(true)}
              variant="outline"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button type="button" onClick={() => setOpen(true)}>
              <Plus />
              Create
            </Button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredLeads}
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

        <LeadImportModal
          open={importDialogOpen}
          onOpenChange={setImportDialogOpen}
        />

        <LeadExportModal
          open={exportDialogOpen}
          onOpenChange={setExportDialogOpen}
          selectedLeads={selectedLeads}
        />
      </div>
    </>
  );
};

export default LeadPage;
