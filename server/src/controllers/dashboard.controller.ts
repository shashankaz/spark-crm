import { Request, Response } from "express";
import { fetchDashboardStatsService } from "../services/dashboard.service";
import { sendSuccess } from "../shared/api-response";
import { asyncHandler } from "../shared/async-handler";

export const getDashboardStats = asyncHandler(
  async (req: Request, res: Response) => {
    const tenantId = req.user.tenantId;

    const { stats, recentLeads, recentDeals } =
      await fetchDashboardStatsService({
        tenantId,
      });

    sendSuccess(res, 200, "Dashboard stats retrieved successfully", {
      stats,
      recentLeads,
      recentDeals,
    });
  },
);
