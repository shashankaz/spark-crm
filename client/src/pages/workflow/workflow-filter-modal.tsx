import { useState } from "react";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import type {
  WorkflowEntityFilter,
  WorkflowEventFilter,
  WorkflowStatusFilter,
  WorkflowFilters,
} from "./workflow-filter-types";
import {
  defaultWorkflowFilters,
  ENTITY_LABELS,
  EVENT_LABELS,
  STATUS_LABELS,
} from "./workflow-filter-types";

interface WorkflowFilterModalProps {
  filters: WorkflowFilters;
  onChange: (filters: WorkflowFilters) => void;
}

export const WorkflowFilterModal = ({
  filters,
  onChange,
}: WorkflowFilterModalProps) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<WorkflowFilters>(filters);

  const activeCount = [
    filters.entity !== "all",
    filters.event !== "all",
    filters.status !== "all",
  ].filter(Boolean).length;

  const handleOpen = () => {
    setDraft(filters);
    setOpen(true);
  };

  const handleApply = () => {
    onChange(draft);
    setOpen(false);
  };

  const handleReset = () => setDraft(defaultWorkflowFilters);

  const handleResetAll = () => {
    onChange(defaultWorkflowFilters);
    setOpen(false);
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={handleOpen}
        className="relative"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filter
        {activeCount > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
            {activeCount}
          </Badge>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Filter Workflows</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Status</Label>
              <div className="flex gap-2">
                {(["all", "active", "inactive"] as WorkflowStatusFilter[]).map(
                  (status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setDraft((d) => ({ ...d, status }))}
                      className={`flex-1 rounded-md border px-3 py-2 text-sm transition-colors ${
                        draft.status === status
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background hover:bg-muted"
                      }`}
                    >
                      {STATUS_LABELS[status]}
                    </button>
                  ),
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Entity</Label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    "all",
                    "lead",
                    "deal",
                    "organization",
                  ] as WorkflowEntityFilter[]
                ).map((entity) => (
                  <button
                    key={entity}
                    type="button"
                    onClick={() => setDraft((d) => ({ ...d, entity }))}
                    className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                      draft.entity === entity
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:bg-muted"
                    }`}
                  >
                    {ENTITY_LABELS[entity]}
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Event</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {(
                  [
                    "all",
                    "create",
                    "update",
                    "delete",
                    "won",
                    "lost",
                    "status_change",
                  ] as WorkflowEventFilter[]
                ).map((event) => (
                  <button
                    key={event}
                    type="button"
                    onClick={() => setDraft((d) => ({ ...d, event }))}
                    className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                      draft.event === event
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:bg-muted"
                    }`}
                  >
                    {EVENT_LABELS[event]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2 items-center sm:justify-between">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="gap-1"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleResetAll}>
                Clear all
              </Button>
              <Button type="button" onClick={handleApply}>
                Apply filters
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
