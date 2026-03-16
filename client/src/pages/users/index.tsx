import { useState, useMemo } from "react";
import debounce from "lodash/debounce";
import { Helmet } from "react-helmet-async";
import { Download, Plus, X } from "lucide-react";
import { useHotkey } from "@tanstack/react-hotkeys";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { columns } from "./columns";
import { UserCreateForm } from "./user-create-form";
import { UserExportModal } from "./user-export-modal";
import { UserFilterModal } from "./user-filter-modal";
import { defaultUserFilters } from "./user-filter-types";
import type { UserFilters } from "./user-filter-types";

import { TableSkeleton } from "@/components/shared/dashboard/skeleton";
import { DataTable } from "@/components/shared/dashboard/data-table";
import { Heading } from "@/components/shared/typography/heading";
import { Description } from "@/components/shared/typography/description";

import { useUsers } from "@/hooks";

import type { User } from "@/types/domain";

const UsersPage = () => {
  const [open, setOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [filters, setFilters] = useState<UserFilters>(defaultUserFilters);

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const handleSearchChange = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearch(value);
      }, 500),
    [],
  );

  const { data, isPending } = useUsers({
    search: debouncedSearch,
    cursor: pageIndex > 0 ? String(pageIndex * pageSize) : undefined,
    limit: pageSize,
    role: filters.role !== "all" ? filters.role : undefined,
  });
  const users = data?.users || [];
  const totalCount = data?.totalCount ?? 0;

  useHotkey("Mod+U", () => setOpen(true));

  if (isPending) return <TableSkeleton />;

  return (
    <>
      <Helmet>
        <title>Users | Dashboard</title>
        <meta name="description" content="Manage users in your CRM" />
      </Helmet>

      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <Heading title="Users" />
            <Description description="Manage your CRM users and their permissions" />
          </div>
          <div className="space-x-2 flex items-center">
            <UserFilterModal filters={filters} onChange={setFilters} />
            <Button type="button" onClick={() => setOpen(true)}>
              <Plus />
              Create
            </Button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={users}
          placeholder="users"
          search={searchInput}
          onSearchChange={(value) => {
            setSearchInput(value);
            handleSearchChange(value);
            setPageIndex(0);
          }}
          onSelectionChange={(rows) => setSelectedUsers(rows as User[])}
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
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">Create New User</DialogTitle>
            </DialogHeader>

            <UserCreateForm setOpen={setOpen} />
          </DialogContent>
        </Dialog>
      </div>

      <UserExportModal
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        selectedUsers={selectedUsers}
      />

      {selectedUsers.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-background border shadow-xl rounded-xl px-5 py-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
            {selectedUsers.length} user{selectedUsers.length !== 1 ? "s" : ""}{" "}
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
            onClick={() => setSelectedUsers([])}
            className="h-7 w-7 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  );
};

export default UsersPage;
