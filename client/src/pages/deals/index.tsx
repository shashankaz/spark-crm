import { useState, useMemo } from "react";
import debounce from "lodash/debounce";
import { Helmet } from "react-helmet-async";
import { Download, X } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Heading } from "@/components/shared/typography/heading";
import { Description } from "@/components/shared/typography/description";
import { DataTable } from "@/components/shared/dashboard/data-table";
import { TableSkeleton } from "@/components/shared/dashboard/skeleton";

import { columns } from "./columns";
import { DealExportModal } from "./deal-export-modal";
import {
  DealFilterModal,
  defaultDealFilters,
  type DealFilters,
} from "./deal-filter-modal";

import { useDeals } from "@/hooks";

import type { IDeal } from "@/types/domain";

const DealPage = () => {
  const [selectedDeals, setSelectedDeals] = useState<IDeal[]>([]);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [filters, setFilters] = useState<DealFilters>(defaultDealFilters);

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

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

  const { data, isPending } = useDeals({
    search: debouncedSearch,
    cursor: pageIndex > 0 ? String(pageIndex * pageSize) : undefined,
    limit: pageSize,
    valueRange: filters.valueRange !== "any" ? filters.valueRange : undefined,
    probability:
      filters.probability !== "any" ? filters.probability : undefined,
  });
  const deals = data?.deals ?? [];
  const totalCount = data?.totalCount ?? 0;

  if (isPending) return <TableSkeleton />;

  return (
    <>
      <Helmet>
        <title>Deals | Dashboard</title>
        <meta name="description" content="Manage deals in your CRM" />
      </Helmet>

      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <Heading title="Deals" />
            <Description description="Manage your CRM deals and their status" />
          </div>
          <div className="flex items-center space-x-2">
            <DealFilterModal
              filters={filters}
              onChange={(f) => {
                setFilters(f);
                setPageIndex(0);
              }}
            />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={deals}
          placeholder="deals"
          search={searchInput}
          onSearchChange={(value) => {
            setSearchInput(value);
            handleSearchChange(value);
          }}
          onSelectionChange={(rows) => setSelectedDeals(rows as IDeal[])}
          totalCount={totalCount}
          pageIndex={pageIndex}
          pageSize={pageSize}
          onPageChange={setPageIndex}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPageIndex(0);
          }}
        />
      </div>

      <DealExportModal
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        selectedDeals={selectedDeals}
      />

      {selectedDeals.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-background border shadow-xl rounded-xl px-5 py-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
            {selectedDeals.length} deal{selectedDeals.length !== 1 ? "s" : ""}{" "}
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
          <div className="h-4 w-px bg-border" />
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setSelectedDeals([])}
            className="h-7 w-7 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  );
};

export default DealPage;
