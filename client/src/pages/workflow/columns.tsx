import { ArrowUpDown } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

import type { Workflow } from "@/types/domain";

import { ActionCell } from "./action-cell";

export const columns: ColumnDef<Workflow>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="mx-3"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    size: 160,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Description
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="truncate max-w-40 text-muted-foreground text-sm">
        {row.original.description || "—"}
      </div>
    ),
  },
  {
    id: "trigger",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Trigger
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const w = row.original;
      return (
        <Badge variant="outline" className="capitalize">
          {w.entity} → {w.event}
        </Badge>
      );
    },
  },
  {
    id: "actions_count",
    header: "Actions",
    cell: ({ row }) => {
      const count = row.original.actions?.length ?? 0;
      return (
        <span className="text-sm text-muted-foreground -mx-3">
          {count} action{count !== 1 ? "s" : ""}
        </span>
      );
    },
  },
  {
    accessorKey: "executionCount",
    header: "Runs",
    cell: ({ row }) => (
      <span className="text-sm -mx-3">{row.original.executionCount ?? 0}</span>
    ),
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const w = row.original;
      return (
        <span className="text-sm -mx-3">
          {w.active ? "Active" : "Inactive"}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionCell workflow={row.original} />,
    enableSorting: false,
    enableHiding: false,
  },
];
