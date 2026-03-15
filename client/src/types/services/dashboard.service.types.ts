export type DashboardStat = {
  value: number;
  change: string;
  trend: "up" | "down";
};

export type DashboardRecentLead = {
  _id: string;
  name: string;
  email: string;
  organization: string;
  score: number;
  updatedAt: string;
};

export type DashboardRecentDeal = {
  _id: string;
  title: string;
  value: number;
  status: string;
  updatedAt: string;
};

export type DashboardStatsData = {
  stats: {
    totalLeads: DashboardStat;
    totalDeals: DashboardStat;
    totalOrganizations: DashboardStat;
    totalUsers: DashboardStat;
  };
  recentLeads: DashboardRecentLead[];
  recentDeals: DashboardRecentDeal[];
};

export type GetDashboardStatsResponse = {
  message: string;
  stats: {
    totalLeads: DashboardStat;
    totalDeals: DashboardStat;
    totalOrganizations: DashboardStat;
    totalUsers: DashboardStat;
  };
  recentLeads: DashboardRecentLead[];
  recentDeals: DashboardRecentDeal[];
};

export type CallActivityItem = {
  month: string;
  inbound: number;
  outbound: number;
};

export type ConversionFunnelItem = {
  stage: string;
  count: number;
};

export type DealPipelineItem = {
  range: string;
  count: number;
  value: number;
};

export type DealWinRateItem = {
  name: string;
  value: number;
};

export type LeadScoreItem = {
  range: string;
  count: number;
};

export type LeadSourceItem = {
  source: string;
  count: number;
};

export type LeadStatusItem = {
  status: string;
  count: number;
};

export type MonthlyRevenueItem = {
  month: string;
  revenue: number;
  deals: number;
};

export type OrgIndustryItem = {
  industry: string;
  count: number;
};

export type RevenueTargetItem = {
  month: string;
  actual: number;
};

export type DashboardWidgetData<T> = {
  data: T[];
};

export type WidgetResponse<T> = {
  message: string;
  data: T[];
};
