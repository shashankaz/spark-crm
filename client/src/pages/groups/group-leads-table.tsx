import { DataTable } from "@/components/shared/dashboard/data-table";

import { columns } from "./columns";

import type { IGroup } from "@/types/domain";

interface GroupLeadsTableProps {
  groups: IGroup[];
  search: string;
  onSearchChange: (value: string) => void;
}

export const GroupLeadsTable: React.FC<GroupLeadsTableProps> = ({
  groups,
  search,
  onSearchChange,
}) => {
  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={groups}
        placeholder="groups"
        search={search}
        onSearchChange={onSearchChange}
      />
    </div>
  );
};
