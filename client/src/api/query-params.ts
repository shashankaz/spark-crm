type QueryKey = {
  cursor?: number;
  limit?: number;
  search?: string;
  orgId?: string;
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
