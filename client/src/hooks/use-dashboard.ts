import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/api/services/dashboard.service";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
