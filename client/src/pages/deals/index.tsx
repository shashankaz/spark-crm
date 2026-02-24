import { useState, useMemo } from "react";
import { debounce } from "lodash";
import { Helmet } from "react-helmet-async";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Heading } from "@/components/shared/typography/heading";
import { Description } from "@/components/shared/typography/description";
import { DataTable } from "@/components/shared/dashboard/data-table";
import { TableSkeleton } from "@/components/shared/dashboard/skeleton";

import { columns } from "./columns";

import { useDeals } from "@/hooks/use-deal";

import { exportDealsToExcel } from "@/utils/export/deal-excel";

import type { Deal } from "@/types";

const DealPage = () => {
  const [selectedDeals, setSelectedDeals] = useState<Deal[]>([]);

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
          <Button
            type="button"
            onClick={() => exportDealsToExcel(selectedDeals)}
            disabled={selectedDeals.length === 0}
          >
            <Download />
            Export
          </Button>
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
    </>
  );
};

export default DealPage;
