import { api } from "@/api";
import { withApiHandler } from "@/api/api-handler";
import type { ApiResponse } from "@/api/api-response";
import type {
  DashboardStatsData,
  GetDashboardStatsResponse,
} from "@/types/services";

export const getDashboardStats = async (): Promise<GetDashboardStatsResponse> =>
  withApiHandler(async () => {
    const response =
      await api.get<ApiResponse<DashboardStatsData>>("/dashboard");

    const { message, data } = response.data;

    return {
      message,
      stats: data.stats,
      recentLeads: data.recentLeads,
      recentDeals: data.recentDeals,
    };
  });
