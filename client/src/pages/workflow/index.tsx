import { useMemo, useState } from "react";
import debounce from "lodash/debounce";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import { Plus } from "lucide-react";
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
import { DataTable } from "@/components/shared/dashboard/data-table";
import { TableSkeleton } from "@/components/shared/dashboard/skeleton";

import { columns } from "./columns";
import { WorkflowCreateForm } from "./workflow-create-form";
import { WorkflowFilterModal } from "./workflow-filter-modal";
import type { WorkflowFormValues } from "./workflow-form-schema";
import type { WorkflowFilters } from "./workflow-filter-types";
import { defaultWorkflowFilters } from "./workflow-filter-types";

import { useWorkflows, useCreateWorkflow } from "@/hooks";

const WorkflowPage = () => {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<WorkflowFilters>(
    defaultWorkflowFilters,
  );

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const handleSearchChange = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearch(value);
      }, 500),
    [],
  );

  const { data, isPending } = useWorkflows({
    search: debouncedSearch,
    entity: filters.entity !== "all" ? filters.entity : undefined,
    event: filters.event !== "all" ? filters.event : undefined,
    active: filters.status !== "all" ? filters.status === "active" : undefined,
  });
  const workflows = data?.workflows ?? [];

  const { mutate: createWorkflow, isPending: isCreating } = useCreateWorkflow();

  useHotkey("Mod+W", () => setOpen(true));

  const handleCreate = (formData: WorkflowFormValues) => {
    const actions = (formData.actions ?? []).map((type) => ({
      type,
      config: (formData.actionConfigs?.[type] as Record<string, unknown>) ?? {},
    }));

    createWorkflow(
      {
        name: formData.name,
        description: formData.description,
        active: formData.active ?? true,
        entity: formData.entity ?? "lead",
        event: formData.event ?? "create",
        actions,
      },
      {
        onSuccess: ({ message }) => {
          toast.success(message);
          setOpen(false);
        },
        onError: ({ message }) => {
          toast.error(message);
        },
      },
    );
  };

  if (isPending) return <TableSkeleton />;

  return (
    <>
      <Helmet>
        <title>Workflows | Dashboard</title>
        <meta name="description" content="Manage automation workflows" />
      </Helmet>

      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <Heading title="Workflows" />
            <Description description="Create automation rules to run actions when events occur" />
          </div>
          <div className="flex items-center space-x-2">
            <WorkflowFilterModal filters={filters} onChange={setFilters} />
            <Button type="button" onClick={() => setOpen(true)}>
              <Plus />
              Create
            </Button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={workflows}
          placeholder="workflows"
          search={searchInput}
          onSearchChange={(value) => {
            setSearchInput(value);
            handleSearchChange(value);
          }}
        />

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-3xl sm:max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                Create New Workflow
              </DialogTitle>
            </DialogHeader>
            <WorkflowCreateForm
              onCreate={handleCreate}
              isLoading={isCreating}
            />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default WorkflowPage;
