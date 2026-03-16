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
