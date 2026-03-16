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

import type { GroupFilters } from "./group-filter-types";
import { defaultGroupFilters, LEAD_COUNT_LABELS } from "./group-filter-types";

interface GroupFilterModalProps {
  filters: GroupFilters;
  onChange: (filters: GroupFilters) => void;
}

export const GroupFilterModal = ({
  filters,
  onChange,
}: GroupFilterModalProps) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<GroupFilters>(filters);

  const activeCount = [filters.leadCount !== "any"].filter(Boolean).length;

  const handleOpen = () => {
    setDraft(filters);
    setOpen(true);
  };

  const handleApply = () => {
    onChange(draft);
    setOpen(false);
  };

  const handleReset = () => setDraft(defaultGroupFilters);

  const handleResetAll = () => {
    onChange(defaultGroupFilters);
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
            <DialogTitle className="text-xl">Filter Groups</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">
                Group Size (Leads)
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {(
                  ["any", "empty", "small", "medium", "large"] as Array<
                    GroupFilters["leadCount"]
                  >
                ).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setDraft((d) => ({ ...d, leadCount: size }))}
                    className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                      draft.leadCount === size
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:bg-muted"
                    }`}
                  >
                    {LEAD_COUNT_LABELS[size]}
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
