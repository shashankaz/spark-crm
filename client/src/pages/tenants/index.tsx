import { useMemo, useState } from "react";
import debounce from "lodash/debounce";
import { Helmet } from "react-helmet-async";
import { Download, Plus, X } from "lucide-react";
import { useHotkey } from "@tanstack/react-hotkeys";

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
import { TenantExportModal } from "./tenant-export-modal";
import {
  TenantFilterModal,
  defaultTenantFilters,
  type TenantFilters,
} from "./tenant-filter-modal";

import { useTenants } from "@/hooks";

import type { Tenant } from "@/types/domain";

const TenantsPage = () => {
  const [open, setOpen] = useState(false);
  const [selectedTenants, setSelectedTenants] = useState<Tenant[]>([]);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState<TenantFilters>(defaultTenantFilters);

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const handleSearchChange = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearch(value);
        setPageIndex(0);
      }, 500),
    [],
  );

  const { data, isPending } = useTenants({
    search: debouncedSearch,
    cursor: pageIndex > 0 ? String(pageIndex * pageSize) : undefined,
    limit: pageSize,
    plan: filters.plan !== "any" ? filters.plan : undefined,
    country: filters.country || undefined,
  });

  const tenants = data?.tenants ?? [];
  const totalCount = data?.totalCount ?? 0;

  useHotkey("Mod+T", () => setOpen(true));

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
          <div className="space-x-2 flex items-center">
            <TenantFilterModal
              filters={filters}
              onChange={(f) => {
                setFilters(f);
                setPageIndex(0);
              }}
            />
            <Button type="button" onClick={() => setOpen(true)}>
              <Plus />
              Create
            </Button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={tenants}
          placeholder="tenants"
          search={searchInput}
          onSearchChange={(value) => {
            setSearchInput(value);
            handleSearchChange(value);
          }}
          onSelectionChange={(rows) => setSelectedTenants(rows as Tenant[])}
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
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">Create New Tenant</DialogTitle>
            </DialogHeader>

            <TenantCreateForm setOpen={setOpen} />
          </DialogContent>
        </Dialog>
      </div>

      <TenantExportModal
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        selectedTenants={selectedTenants}
      />

      {selectedTenants.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-background border shadow-xl rounded-xl px-5 py-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
            {selectedTenants.length} tenant
            {selectedTenants.length !== 1 ? "s" : ""} selected
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
          <div className="h-4 w-px bg-border" />
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setSelectedTenants([]);
            }}
            className="h-7 w-7 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  );
};

export default TenantsPage;
