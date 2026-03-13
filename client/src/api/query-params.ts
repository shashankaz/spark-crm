type QueryKey = {
  cursor?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;

  // Lead
  assignment?: string;
  scoreRange?: string;
  orgName?: string;

  // Contact
  role?: string;
  starred?: string;
  department?: string;
  lastContactedBefore?: string;
  lastContactedAfter?: string;
  orgId?: string;

  // Deal
  valueRange?: string;
  probability?: string;
  industry?: string;

  // Organization
  size?: string;
  country?: string;

  // User
  entity?: string;

  // Workflow
  event?: string;
  active?: boolean;

  // Group
  leadCount?: string;
};
type QueryValue = string | number | boolean | null | undefined;
type QueryParams = Partial<Record<keyof QueryKey, QueryValue>>;

export const buildQueryParams = (params: QueryParams): string => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed === "") return;
      query.append(key, trimmed);
      return;
    }

    query.append(key, value.toString());
  });

  return query.toString();
};
