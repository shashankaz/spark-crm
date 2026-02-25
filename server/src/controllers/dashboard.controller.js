import { fetchDashboardStatsService } from "../services/dashboard.service.js";
import { sendSuccess } from "../shared/api-response.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    const tenantId = req.user.tenantId;

    const { stats, recentLeads, recentDeals } =
      await fetchDashboardStatsService({ tenantId });

    sendSuccess(res, 200, "Dashboard stats retrieved successfully", {
      stats,
      recentLeads,
      recentDeals,
    });
  } catch (error) {
    next(error);
  }
};
