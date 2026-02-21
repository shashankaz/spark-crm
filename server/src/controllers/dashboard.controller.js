import { fetchDashboardStatsService } from "../services/dashboard.service.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    const tenantId = req.user.tenantId;

    const { stats, recentLeads, recentDeals } =
      await fetchDashboardStatsService({ tenantId });

    res.json({
      success: true,
      message: "Dashboard stats retrieved successfully",
      data: { stats, recentLeads, recentDeals },
    });
  } catch (error) {
    next(error);
  }
};
