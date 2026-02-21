import { api } from "@/api";

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

export const getDashboardStats =
  async (): Promise<GetDashboardStatsResponse> => {
    try {
      const response = await api.get("/dashboard");

      const { message } = response.data;
      const { stats, recentLeads, recentDeals } = response.data.data;

      return { message, stats, recentLeads, recentDeals };
    } catch (error) {
      console.error("Get dashboard stats error:", error);
      throw error;
    }
  };
