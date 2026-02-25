import { useQuery } from "@tanstack/react-query";
import { getAllDeals } from "@/api/services";

export const useDeals = ({
  cursor,
  limit = 10,
  search,
}: {
  cursor?: string;
  limit?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["deals", { cursor, limit, search }],
    queryFn: () => getAllDeals({ cursor, limit, search }),
  });
};
