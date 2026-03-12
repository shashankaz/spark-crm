import { useState, useMemo } from "react";
import debounce from "lodash/debounce";

import { DataTable } from "@/components/shared/dashboard/data-table";

import { columns } from "./columns";

import type { IGroup } from "@/types/domain";

interface GroupLeadsTableProps {
  groups: IGroup[];
}

export const GroupLeadsTable: React.FC<GroupLeadsTableProps> = ({ groups }) => {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const handleSearchChange = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearch(value);
      }, 500),
    [],
  );

  // Move this search logic to backend
  const filteredGroups = useMemo(() => {
    if (!debouncedSearch) return groups;
    const lower = debouncedSearch.toLowerCase();
    return groups.filter(
      (g) =>
        g.name.toLowerCase().includes(lower) ||
        (g.description ?? "").toLowerCase().includes(lower),
    );
  }, [groups, debouncedSearch]);

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={filteredGroups}
        placeholder="groups"
        search={searchInput}
        onSearchChange={(value) => {
          setSearchInput(value);
          handleSearchChange(value);
        }}
      />
    </div>
  );
};
