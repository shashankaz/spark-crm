import { useState, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table";
import type {
  ColumnDef,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { SelectVisibleCols } from "./select-visible-cols";
import { SearchInput } from "./search-input";
import { Pagination } from "./pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  placeholder: string;
  onSelectionChange?: (selectedRows: TData[]) => void;
  search: string;
  onSearchChange: (value: string) => void;
  totalCount?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageIndex?: number;
  pageSize?: number;
}

export const DataTable = <TData, TValue>({
  columns,
  data,
  placeholder,
  onSelectionChange,
  search,
  onSearchChange,
  totalCount,
  onPageChange,
  onPageSizeChange,
  pageIndex: controlledPageIndex,
  pageSize: controlledPageSize,
}: DataTableProps<TData, TValue>) => {
  const isServerPaginated =
    typeof onPageChange === "function" && typeof totalCount === "number";

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [localPageIndex, setLocalPageIndex] = useState(0);
  const [localPageSize, setLocalPageSize] = useState(10);

  const currentPageIndex = isServerPaginated
    ? (controlledPageIndex ?? 0)
    : localPageIndex;
  const currentPageSize = isServerPaginated
    ? (controlledPageSize ?? 10)
    : localPageSize;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: (updater) => {
      setRowSelection((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        return next;
      });
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    ...(isServerPaginated
      ? {
          manualPagination: true,
          pageCount: Math.ceil(totalCount! / currentPageSize),
          onPaginationChange: (updater) => {
            const prev = {
              pageIndex: currentPageIndex,
              pageSize: currentPageSize,
            };
            const next =
              typeof updater === "function" ? updater(prev) : updater;
            if (next.pageIndex !== prev.pageIndex)
              onPageChange!(next.pageIndex);
            if (next.pageSize !== prev.pageSize)
              onPageSizeChange?.(next.pageSize);
          },
        }
      : {
          onPaginationChange: (updater) => {
            const prev = { pageIndex: localPageIndex, pageSize: localPageSize };
            const next =
              typeof updater === "function" ? updater(prev) : updater;
            setLocalPageIndex(next.pageIndex);
            setLocalPageSize(next.pageSize);
          },
        }),
    state: {
      columnVisibility,
      rowSelection,
      sorting,
      pagination: {
        pageIndex: currentPageIndex,
        pageSize: currentPageSize,
      },
    },
  });

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(
        table.getFilteredSelectedRowModel().rows.map((row) => row.original),
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowSelection]);

  useEffect(() => {
    if (isServerPaginated) {
      onPageChange!(0);
    } else {
      setLocalPageIndex(0);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const totalRows = isServerPaginated
    ? totalCount!
    : table.getFilteredRowModel().rows.length;
  const selectedRowsCount = table.getFilteredSelectedRowModel().rows.length;
  const canNextPage = table.getCanNextPage();
  const canPreviousPage = table.getCanPreviousPage();

  return (
    <>
      <div className="flex justify-end mb-4 gap-2">
        <SearchInput
          placeholder={`Search ${placeholder}`}
          value={search}
          onChange={onSearchChange}
        />
        <SelectVisibleCols table={table} columnVisibility={columnVisibility} />
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-5">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No {placeholder} found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {data.length > 0 && (
        <Pagination
          pageSize={currentPageSize}
          onPageSizeChange={(size) => {
            table.setPageSize(size);
          }}
          nextCursor={canNextPage ? "next" : null}
          prevCursor={canPreviousPage ? "prev" : null}
          onNext={() => table.nextPage()}
          onPrevious={() => table.previousPage()}
          totalRows={totalRows}
          placeholder={placeholder}
          selectedRowsCount={selectedRowsCount}
        />
      )}
    </>
  );
};
