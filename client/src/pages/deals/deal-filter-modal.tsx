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

export interface DealFilters {
  valueRange: "any" | "low" | "medium" | "high";
  probability: "any" | "low" | "medium" | "high";
}

export const defaultDealFilters: DealFilters = {
  valueRange: "any",
  probability: "any",
};

export const VALUE_RANGE_LABELS: Record<DealFilters["valueRange"], string> = {
  any: "Any value",
  low: "Low (< ₹10k)",
  medium: "Medium (₹10k - ₹100k)",
  high: "High (> ₹100k)",
};

export const PROBABILITY_LABELS: Record<DealFilters["probability"], string> = {
  any: "Any",
  low: "Low (0 - 30%)",
  medium: "Medium (31 - 60%)",
  high: "High (61 - 100%)",
};

interface DealFilterModalProps {
  filters: DealFilters;
  onChange: (filters: DealFilters) => void;
}

export const DealFilterModal = ({
  filters,
  onChange,
}: DealFilterModalProps) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DealFilters>(filters);

  const activeCount = [
    filters.valueRange !== "any",
    filters.probability !== "any",
  ].filter(Boolean).length;

  const handleOpen = () => {
    setDraft(filters);
    setOpen(true);
  };

  const handleApply = () => {
    onChange(draft);
    setOpen(false);
  };

  const handleReset = () => setDraft(defaultDealFilters);

  const handleResetAll = () => {
    onChange(defaultDealFilters);
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
            <DialogTitle className="text-xl">Filter Deals</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Deal Value</Label>
              <div className="grid grid-cols-2 gap-2">
                {(["any", "low", "medium", "high"] as const).map((range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() =>
                      setDraft((d) => ({ ...d, valueRange: range }))
                    }
                    className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                      draft.valueRange === range
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:bg-muted"
                    }`}
                  >
                    {VALUE_RANGE_LABELS[range]}
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Probability</Label>
              <div className="grid grid-cols-2 gap-2">
                {(["any", "low", "medium", "high"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setDraft((d) => ({ ...d, probability: p }))}
                    className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                      draft.probability === p
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:bg-muted"
                    }`}
                  >
                    {PROBABILITY_LABELS[p]}
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
