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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export type ScoreRange = "any" | "low" | "medium" | "high";

export interface LeadFilters {
  assignment: "all" | "assigned";
  orgName: string;
  scoreRange: ScoreRange;
}

export const defaultFilters: LeadFilters = {
  assignment: "all",
  orgName: "",
  scoreRange: "any",
};

export const SCORE_RANGE_LABELS: Record<ScoreRange, string> = {
  any: "Any score",
  low: "Low (0 - 30)",
  medium: "Medium (31 - 60)",
  high: "High (61 - 100)",
};

interface LeadFilterModalProps {
  filters: LeadFilters;
  orgNames: string[];
  onChange: (filters: LeadFilters) => void;
}

export const LeadFilterModal = ({
  filters,
  orgNames,
  onChange,
}: LeadFilterModalProps) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<LeadFilters>(filters);

  const activeCount = [
    filters.assignment !== "all",
    filters.orgName !== "",
    filters.scoreRange !== "any",
  ].filter(Boolean).length;

  const handleOpen = () => {
    setDraft(filters);
    setOpen(true);
  };

  const handleApply = () => {
    onChange(draft);
    setOpen(false);
  };

  const handleReset = () => {
    setDraft(defaultFilters);
  };

  const handleResetAll = () => {
    onChange(defaultFilters);
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Filter Leads</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Assignment</Label>
              <div className="flex gap-2">
                {(["all", "assigned"] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      setDraft((d) => ({ ...d, assignment: value }))
                    }
                    className={`flex-1 rounded-md border px-3 py-2 text-sm transition-colors ${
                      draft.assignment === value
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:bg-muted"
                    }`}
                  >
                    {value === "all" ? "All Leads" : "Assigned to Me"}
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Organization</Label>
              <Select
                value={draft.orgName || "__all__"}
                onValueChange={(val) =>
                  setDraft((d) => ({
                    ...d,
                    orgName: val === "__all__" ? "" : val,
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All organizations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All organizations</SelectItem>
                  <SelectItem value="__unassigned__">
                    No organization
                  </SelectItem>
                  {orgNames.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Lead Score</Label>
              <div className="grid grid-cols-2 gap-2">
                {(["any", "low", "medium", "high"] as ScoreRange[]).map(
                  (range) => (
                    <button
                      key={range}
                      type="button"
                      onClick={() =>
                        setDraft((d) => ({ ...d, scoreRange: range }))
                      }
                      className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                        draft.scoreRange === range
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background hover:bg-muted"
                      }`}
                    >
                      {SCORE_RANGE_LABELS[range]}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2 sm:justify-between">
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
