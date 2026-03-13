import { useState, useMemo } from "react";
import debounce from "lodash/debounce";
import { Helmet } from "react-helmet-async";
import { useHotkey } from "@tanstack/react-hotkeys";
import { Download, Plus, Trash2, Upload, X } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

import { useLeads, useBulkDeleteLeads } from "@/hooks";

import type { ILead } from "@/types/domain";

const LeadPage = () => {
  const [open, setOpen] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<ILead[]>([]);

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState<LeadFilters>(defaultFilters);

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { mutate: bulkDelete, isPending: isDeleting } = useBulkDeleteLeads();

  const handleBulkDelete = async () => {
    bulkDelete(
      { leadIds: selectedLeads.map((l) => l._id) },
      {
        onSuccess: ({ message }) => {
          toast.success(message);
          setSelectedLeads([]);
        },
        onError: ({ message }) => {
          toast.error(message);
        },
        onSettled: () => {
          setDeleteDialogOpen(false);
        },
      },
    );
  };

  const handleSearchChange = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearch(value);
        setPageIndex(0);
      }, 500),
    [],
  );

  const { isPending, data } = useLeads({
    search: debouncedSearch,
    cursor: pageIndex > 0 ? String(pageIndex * pageSize) : undefined,
    limit: pageSize,
    assignment: filters.assignment,
    scoreRange: filters.scoreRange,
  });

  const leads = data?.leads ?? [];
  const totalCount = data?.totalCount ?? 0;

  useHotkey("Mod+L", () => setOpen(true));

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
              onChange={(f) => {
                setFilters(f);
                setPageIndex(0);
              }}
            />
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
          data={leads}
          placeholder="leads"
          search={searchInput}
          onSearchChange={(value) => {
            setSearchInput(value);
            handleSearchChange(value);
          }}
          onSelectionChange={(rows) => setSelectedLeads(rows as ILead[])}
          totalCount={totalCount}
          pageIndex={pageIndex}
          pageSize={pageSize}
          onPageChange={setPageIndex}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPageIndex(0);
          }}
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

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Delete {selectedLeads.length} lead
                {selectedLeads.length !== 1 ? "s" : ""}?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the selected lead
                {selectedLeads.length !== 1 ? "s" : ""} and all associated data.
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleBulkDelete}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {selectedLeads.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-background border shadow-xl rounded-xl px-5 py-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
            {selectedLeads.length} lead{selectedLeads.length !== 1 ? "s" : ""}{" "}
            selected
          </span>
          <div className="h-4 w-px bg-border" />
          <Button
            size="sm"
            variant="outline"
            onClick={() => setExportDialogOpen(true)}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
          <div className="h-4 w-px bg-border" />
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setSelectedLeads([])}
            className="h-7 w-7 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  );
};

export default LeadPage;
