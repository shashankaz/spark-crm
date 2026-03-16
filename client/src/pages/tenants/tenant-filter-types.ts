export type TenantPlanFilter = "any" | "Free" | "Basic" | "Pro" | "Enterprise";

export interface TenantFilters {
  plan: TenantPlanFilter;
  country: string;
}

export const defaultTenantFilters: TenantFilters = {
  plan: "any",
  country: "",
};

export const PLAN_FILTER_LABELS: Record<TenantPlanFilter, string> = {
  any: "Any plan",
  Free: "Free",
  Basic: "Basic",
  Pro: "Pro",
  Enterprise: "Enterprise",
};
