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

import { useDeals } from "@/hooks";

import type { Deal } from "@/types/domain";

const DealPage = () => {
  const [selectedDeals, setSelectedDeals] = useState<Deal[]>([]);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const handleSearchChange = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearch(value);
      }, 500),
    [],
  );

  const { data, isPending } = useDeals({ search: debouncedSearch });
  const deals = data?.deals ?? [];

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
          onSelectionChange={(rows) => setSelectedDeals(rows as Deal[])}
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
            onClick={() => {
              setSelectedDeals([]);
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

export default DealPage;
