import { Request, Response } from "express";
import {
  fetchDashboardStatsService,
  fetchCallActivityService,
  fetchConversionFunnelService,
  fetchDealPipelineService,
  fetchDealWinRateService,
  fetchLeadScoreService,
  fetchLeadSourcesService,
  fetchLeadStatusService,
  fetchMonthlyRevenueService,
  fetchOrgIndustryService,
  fetchRevenueTargetService,
} from "./services/dashboard.service";
import { sendSuccess } from "../../shared/api-response";
import { asyncHandler } from "../../shared/async-handler";

export const getDashboardStats = asyncHandler(
  async (req: Request, res: Response) => {
    const { _id: userId, tenantId, role } = req.user;

    const { stats, recentLeads, recentDeals } =
      await fetchDashboardStatsService({
        tenantId,
        userId,
        role,
      });

    sendSuccess(res, 200, "Dashboard stats retrieved successfully", {
      stats,
      recentLeads,
      recentDeals,
    });
  },
);

export const getCallActivity = asyncHandler(
  async (req: Request, res: Response) => {
    const { _id: userId, tenantId, role } = req.user;

    const { data } = await fetchCallActivityService({ tenantId, userId, role });

    sendSuccess(res, 200, "Call activity retrieved successfully", { data });
  },
);

export const getConversionFunnel = asyncHandler(
  async (req: Request, res: Response) => {
    const { _id: userId, tenantId, role } = req.user;

    const { data } = await fetchConversionFunnelService({
      tenantId,
      userId,
      role,
    });

    sendSuccess(res, 200, "Conversion funnel retrieved successfully", { data });
  },
);

export const getDealPipeline = asyncHandler(
  async (req: Request, res: Response) => {
    const { _id: userId, tenantId, role } = req.user;

    const { data } = await fetchDealPipelineService({ tenantId, userId, role });

    sendSuccess(res, 200, "Deal pipeline retrieved successfully", { data });
  },
);

export const getDealWinRate = asyncHandler(
  async (req: Request, res: Response) => {
    const { _id: userId, tenantId, role } = req.user;

    const { data } = await fetchDealWinRateService({ tenantId, userId, role });

    sendSuccess(res, 200, "Deal win rate retrieved successfully", { data });
  },
);

export const getLeadScore = asyncHandler(
  async (req: Request, res: Response) => {
    const { _id: userId, tenantId, role } = req.user;

    const { data } = await fetchLeadScoreService({ tenantId, userId, role });

    sendSuccess(res, 200, "Lead score distribution retrieved successfully", {
      data,
    });
  },
);

export const getLeadSources = asyncHandler(
  async (req: Request, res: Response) => {
    const { _id: userId, tenantId, role } = req.user;

    const { data } = await fetchLeadSourcesService({ tenantId, userId, role });

    sendSuccess(res, 200, "Lead sources retrieved successfully", { data });
  },
);

export const getLeadStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { _id: userId, tenantId, role } = req.user;

    const { data } = await fetchLeadStatusService({ tenantId, userId, role });

    sendSuccess(res, 200, "Lead status distribution retrieved successfully", {
      data,
    });
  },
);

export const getMonthlyRevenue = asyncHandler(
  async (req: Request, res: Response) => {
    const { _id: userId, tenantId, role } = req.user;

    const { data } = await fetchMonthlyRevenueService({
      tenantId,
      userId,
      role,
    });

    sendSuccess(res, 200, "Monthly revenue retrieved successfully", { data });
  },
);

export const getOrgIndustry = asyncHandler(
  async (req: Request, res: Response) => {
    const { _id: userId, tenantId, role } = req.user;

    const { data } = await fetchOrgIndustryService({ tenantId, userId, role });

    sendSuccess(
      res,
      200,
      "Organization industry distribution retrieved successfully",
      {
        data,
      },
    );
  },
);

export const getRevenueTarget = asyncHandler(
  async (req: Request, res: Response) => {
    const { _id: userId, tenantId, role } = req.user;

    const { data } = await fetchRevenueTargetService({
      tenantId,
      userId,
      role,
    });

    sendSuccess(res, 200, "Revenue vs target retrieved successfully", { data });
  },
);
