import { useState, useMemo } from "react";
import debounce from "lodash/debounce";
import { Helmet } from "react-helmet-async";
import { Plus, UserCircle2, Star, Trash2, X } from "lucide-react";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { DataTable } from "@/components/shared/dashboard/data-table";
import { Pagination } from "@/components/shared/dashboard/pagination";
import { TableSkeleton } from "@/components/shared/dashboard/skeleton";
import { Heading } from "@/components/shared/typography/heading";
import { Description } from "@/components/shared/typography/description";

import { columns } from "./columns";
import { ContactCard } from "./contact-card";
import { ContactCreateForm } from "./contact-create-form";
import {
  ContactFilterModal,
  defaultContactFilters,
  type ContactFilters,
} from "./contact-filter-modal";

import { useContacts, useBulkDeleteContacts } from "@/hooks";

import type { IContact } from "@/types/domain";

const ContactsPage = () => {
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"cards" | "table">("table");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [filters, setFilters] = useState<ContactFilters>(defaultContactFilters);
  const [activeTab, setActiveTab] = useState("all");

  const [selectedContacts, setSelectedContacts] = useState<IContact[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { mutate: bulkDelete, isPending: isDeleting } = useBulkDeleteContacts();

  const handleSearchChange = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearch(value);
        setPageIndex(0);
      }, 400),
    [],
  );

  const { isPending, data } = useContacts({
    search: debouncedSearch || undefined,
    cursor: pageIndex > 0 ? String(pageIndex * pageSize) : undefined,
    limit: pageSize,
    starred:
      filters.starred === "starred"
        ? true
        : filters.starred === "unstarred"
          ? false
          : undefined,
  });

  const contacts = data?.contacts ?? [];
  const totalCount = data?.totalCount ?? 0;

  const displayedContacts =
    activeTab === "starred" ? contacts.filter((c) => c.starred) : contacts;

  const handleBulkDelete = async () => {
    bulkDelete(
      {
        ids: selectedContacts.map((c) => c._id),
      },
      {
        onSuccess: ({ message }) => {
          toast.success(message);
          setSelectedContacts([]);
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

  const totalRows =
    activeTab === "starred" ? displayedContacts.length : totalCount;
  const canPreviousPage = pageIndex > 0;
  const canNextPage = (pageIndex + 1) * pageSize < totalRows;

  if (isPending) return <TableSkeleton />;

  return (
    <>
      <Helmet>
        <title>Contacts | Dashboard</title>
        <meta name="description" content="Manage your B2B contacts" />
      </Helmet>

      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <Heading title="Contacts" />
            <Description description="Manage individual contacts across your accounts and organizations" />
          </div>
          <div className="flex items-center gap-2">
            <ContactFilterModal filters={filters} onChange={setFilters} />
            <Button type="button" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Add Contact
            </Button>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(v) => {
            setActiveTab(v);
            setPageIndex(0);
          }}
        >
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <TabsList>
              <TabsTrigger value="all">
                <UserCircle2 className="h-3.5 w-3.5 mr-1" />
                All Contacts
                <span className="ml-1 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium">
                  {totalCount}
                </span>
              </TabsTrigger>
              <TabsTrigger value="starred">
                <Star className="h-3.5 w-3.5 mr-1" />
                Starred
                <span className="ml-1 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium">
                  {contacts.filter((c) => c.starred).length}
                </span>
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center rounded-md border">
              <Button
                variant={viewMode === "table" ? "secondary" : "ghost"}
                size="sm"
                className="h-9 rounded-r-none border-r px-3"
                onClick={() => setViewMode("table")}
              >
                List
              </Button>
              <Button
                variant={viewMode === "cards" ? "secondary" : "ghost"}
                size="sm"
                className="h-9 rounded-l-none px-3"
                onClick={() => setViewMode("cards")}
              >
                Grid
              </Button>
            </div>
          </div>

          <TabsContent value={activeTab} className="mt-4">
            {displayedContacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
                <UserCircle2 className="h-12 w-12 opacity-20" />
                <p className="text-sm">No contacts found</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add your first contact
                </Button>
              </div>
            ) : viewMode === "table" ? (
              <div className="space-y-4">
                <DataTable
                  columns={columns}
                  data={displayedContacts}
                  placeholder="contacts"
                  search={searchInput}
                  onSearchChange={(value) => {
                    setSearchInput(value);
                    handleSearchChange(value);
                  }}
                  onSelectionChange={(rows) =>
                    setSelectedContacts(rows as IContact[])
                  }
                  totalCount={
                    activeTab === "starred"
                      ? displayedContacts.length
                      : totalCount
                  }
                  pageIndex={pageIndex}
                  pageSize={pageSize}
                  onPageChange={setPageIndex}
                  onPageSizeChange={(size) => {
                    setPageSize(size);
                    setPageIndex(0);
                  }}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {displayedContacts.map((contact) => (
                    <ContactCard key={contact._id} contact={contact} />
                  ))}
                </div>

                <Pagination
                  pageSize={pageSize}
                  onPageSizeChange={(size) => {
                    setPageSize(size);
                    setPageIndex(0);
                  }}
                  nextCursor={canNextPage ? "next" : null}
                  prevCursor={canPreviousPage ? "prev" : null}
                  onNext={() => setPageIndex((p) => p + 1)}
                  onPrevious={() => setPageIndex((p) => p - 1)}
                  totalRows={totalRows}
                  placeholder="contacts"
                  selectedRowsCount={0}
                />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Add New Contact</DialogTitle>
          </DialogHeader>
          <ContactCreateForm setOpen={setOpen} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {selectedContacts.length} contact
              {selectedContacts.length !== 1 ? "s" : ""}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the selected contact
              {selectedContacts.length !== 1 ? "s" : ""}. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
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

      {selectedContacts.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-background border shadow-xl rounded-xl px-5 py-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
            {selectedContacts.length} contact
            {selectedContacts.length !== 1 ? "s" : ""} selected
          </span>
          <div className="h-4 w-px bg-border" />
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
            onClick={() => setSelectedContacts([])}
            className="h-7 w-7 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  );
};

export default ContactsPage;
