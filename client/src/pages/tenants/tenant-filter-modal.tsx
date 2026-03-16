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

import { countriesFlag } from "@/utils/countries/countries-flag";

import type { TenantPlanFilter, TenantFilters } from "./tenant-filter-types";
import {
  defaultTenantFilters,
  PLAN_FILTER_LABELS,
} from "./tenant-filter-types";

interface TenantFilterModalProps {
  filters: TenantFilters;
  onChange: (filters: TenantFilters) => void;
}

export const TenantFilterModal = ({
  filters,
  onChange,
}: TenantFilterModalProps) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<TenantFilters>(filters);

  const activeCount = [filters.plan !== "any", filters.country !== ""].filter(
    Boolean,
  ).length;

  const handleOpen = () => {
    setDraft(filters);
    setOpen(true);
  };

  const handleApply = () => {
    onChange(draft);
    setOpen(false);
  };

  const handleReset = () => {
    setDraft(defaultTenantFilters);
  };

  const handleResetAll = () => {
    onChange(defaultTenantFilters);
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
            <DialogTitle className="text-xl">Filter Tenants</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Plan</Label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(PLAN_FILTER_LABELS) as TenantPlanFilter[]).map(
                  (plan) => (
                    <button
                      key={plan}
                      type="button"
                      onClick={() => setDraft((d) => ({ ...d, plan }))}
                      className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                        draft.plan === plan
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background hover:bg-muted"
                      }`}
                    >
                      {PLAN_FILTER_LABELS[plan]}
                    </button>
                  ),
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Country</Label>
              <Select
                value={draft.country || "__all__"}
                onValueChange={(val) =>
                  setDraft((d) => ({
                    ...d,
                    country: val === "__all__" ? "" : val,
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All countries" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    {
                      label: "All countries",
                      flag: "https://flagcdn.com/w40/un.png",
                      value: "__all__",
                    },
                    ...countriesFlag.map((c) => ({ ...c, value: c.label })),
                  ].map((country) => (
                    <SelectItem
                      key={country.label.toLowerCase()}
                      value={country.value}
                    >
                      <img
                        src={country.flag}
                        alt={country.label}
                        className="w-6 h-4 mr-2 inline-block"
                      />
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
