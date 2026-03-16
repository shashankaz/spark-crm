export interface GroupFilters {
  leadCount: "any" | "empty" | "small" | "medium" | "large";
}

export const defaultGroupFilters: GroupFilters = {
  leadCount: "any",
};

export const LEAD_COUNT_LABELS: Record<GroupFilters["leadCount"], string> = {
  any: "Any size",
  empty: "Empty (0)",
  small: "Small (1 - 10)",
  medium: "Medium (11 - 50)",
  large: "Large (50+)",
};
