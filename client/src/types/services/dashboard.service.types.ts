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
