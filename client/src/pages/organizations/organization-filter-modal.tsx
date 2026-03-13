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

export type OrgIndustry =
  | "any"
  | "technology"
  | "finance"
  | "healthcare"
  | "education"
  | "retail"
  | "manufacturing"
  | "real estate"
  | "other";

export type OrgSize = "any" | "smb" | "mid-market" | "enterprise";

export interface OrganizationFilters {
  industry: OrgIndustry;
  size: OrgSize;
  country: string;
}

export const defaultOrganizationFilters: OrganizationFilters = {
  industry: "any",
  size: "any",
  country: "",
};

export const INDUSTRY_LABELS: Record<OrgIndustry, string> = {
  any: "Any industry",
  technology: "Technology",
  finance: "Finance",
  healthcare: "Healthcare",
  education: "Education",
  retail: "Retail",
  manufacturing: "Manufacturing",
  "real estate": "Real Estate",
  other: "Other",
};

export const SIZE_LABELS: Record<OrgSize, string> = {
  any: "Any size",
  smb: "SMB",
  "mid-market": "Mid-Market",
  enterprise: "Enterprise",
};

interface OrganizationFilterModalProps {
  filters: OrganizationFilters;
  onChange: (filters: OrganizationFilters) => void;
}

export const OrganizationFilterModal = ({
  filters,
  onChange,
}: OrganizationFilterModalProps) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<OrganizationFilters>(filters);

  const activeCount = [
    filters.industry !== "any",
    filters.size !== "any",
    filters.country !== "",
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
    setDraft(defaultOrganizationFilters);
  };

  const handleResetAll = () => {
    onChange(defaultOrganizationFilters);
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
            <DialogTitle className="text-xl">Filter Organizations</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Industry</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {(Object.keys(INDUSTRY_LABELS) as OrgIndustry[]).map((ind) => (
                  <button
                    key={ind}
                    type="button"
                    onClick={() => setDraft((d) => ({ ...d, industry: ind }))}
                    className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                      draft.industry === ind
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:bg-muted"
                    }`}
                  >
                    {INDUSTRY_LABELS[ind]}
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Size</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {(Object.keys(SIZE_LABELS) as OrgSize[]).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setDraft((d) => ({ ...d, size }))}
                    className={`flex-1 rounded-md border px-3 py-2 text-sm transition-colors ${
                      draft.size === size
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:bg-muted"
                    }`}
                  >
                    {SIZE_LABELS[size]}
                  </button>
                ))}
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
                      key={country.label.toLocaleLowerCase()}
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
