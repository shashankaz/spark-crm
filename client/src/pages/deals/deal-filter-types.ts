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
