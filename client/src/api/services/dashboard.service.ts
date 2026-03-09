import { api } from "@/api";
import { withApiHandler } from "@/api/api-handler";
import type { ApiResponse } from "@/api/api-response";
import type {
  DashboardStatsData,
  GetDashboardStatsResponse,
  WidgetResponse,
  CallActivityItem,
  ConversionFunnelItem,
  DealPipelineItem,
  DealWinRateItem,
  LeadScoreItem,
  LeadSourceItem,
  LeadStatusItem,
  MonthlyRevenueItem,
  OrgIndustryItem,
  RevenueTargetItem,
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

export const getCallActivity = async (): Promise<
  WidgetResponse<CallActivityItem>
> =>
  withApiHandler(async () => {
    const response = await api.get<ApiResponse<{ data: CallActivityItem[] }>>(
      "/dashboard/call-activity",
    );

    const { message, data } = response.data;

    return { message, data: data.data };
  });

export const getConversionFunnel = async (): Promise<
  WidgetResponse<ConversionFunnelItem>
> =>
  withApiHandler(async () => {
    const response = await api.get<
      ApiResponse<{ data: ConversionFunnelItem[] }>
    >("/dashboard/conversion-funnel");

    const { message, data } = response.data;

    return { message, data: data.data };
  });

export const getDealPipeline = async (): Promise<
  WidgetResponse<DealPipelineItem>
> =>
  withApiHandler(async () => {
    const response = await api.get<ApiResponse<{ data: DealPipelineItem[] }>>(
      "/dashboard/deal-pipeline",
    );

    const { message, data } = response.data;

    return { message, data: data.data };
  });

export const getDealWinRate = async (): Promise<
  WidgetResponse<DealWinRateItem>
> =>
  withApiHandler(async () => {
    const response = await api.get<ApiResponse<{ data: DealWinRateItem[] }>>(
      "/dashboard/deal-win-rate",
    );
    const { message, data } = response.data;
    return { message, data: data.data };
  });

export const getLeadScore = async (): Promise<WidgetResponse<LeadScoreItem>> =>
  withApiHandler(async () => {
    const response = await api.get<ApiResponse<{ data: LeadScoreItem[] }>>(
      "/dashboard/lead-score",
    );

    const { message, data } = response.data;

    return { message, data: data.data };
  });

export const getLeadSources = async (): Promise<
  WidgetResponse<LeadSourceItem>
> =>
  withApiHandler(async () => {
    const response = await api.get<ApiResponse<{ data: LeadSourceItem[] }>>(
      "/dashboard/lead-sources",
    );

    const { message, data } = response.data;

    return { message, data: data.data };
  });

export const getLeadStatus = async (): Promise<
  WidgetResponse<LeadStatusItem>
> =>
  withApiHandler(async () => {
    const response = await api.get<ApiResponse<{ data: LeadStatusItem[] }>>(
      "/dashboard/lead-status",
    );

    const { message, data } = response.data;

    return { message, data: data.data };
  });

export const getMonthlyRevenue = async (): Promise<
  WidgetResponse<MonthlyRevenueItem>
> =>
  withApiHandler(async () => {
    const response = await api.get<ApiResponse<{ data: MonthlyRevenueItem[] }>>(
      "/dashboard/monthly-revenue",
    );

    const { message, data } = response.data;

    return { message, data: data.data };
  });

export const getOrgIndustry = async (): Promise<
  WidgetResponse<OrgIndustryItem>
> =>
  withApiHandler(async () => {
    const response = await api.get<ApiResponse<{ data: OrgIndustryItem[] }>>(
      "/dashboard/org-industry",
    );

    const { message, data } = response.data;

    return { message, data: data.data };
  });

export const getRevenueTarget = async (): Promise<
  WidgetResponse<RevenueTargetItem>
> =>
  withApiHandler(async () => {
    const response = await api.get<ApiResponse<{ data: RevenueTargetItem[] }>>(
      "/dashboard/revenue-target",
    );

    const { message, data } = response.data;

    return { message, data: data.data };
  });
