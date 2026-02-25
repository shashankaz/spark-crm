import { fetchDashboardStatsService } from "../services/dashboard.service.js";
import { sendSuccess } from "../shared/api-response.js";
import { asyncHandler } from "../shared/async-handler.js";

export const getDashboardStats = asyncHandler(async (req, res, next) => {
  const tenantId = req.user.tenantId;

  const { stats, recentLeads, recentDeals } = await fetchDashboardStatsService({
    tenantId,
  });

  sendSuccess(res, 200, "Dashboard stats retrieved successfully", {
    stats,
    recentLeads,
    recentDeals,
  });
});
