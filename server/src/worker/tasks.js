import { formatDate } from "date-fns";
import { calcChange, getDealStatus } from "../utils/stats-helper.js";

export const calcDashboardStats = ({
  totalLeads,
  leadsLastMonth,
  totalDeals,
  dealsLastMonth,
  totalOrganizations,
  orgsLastMonth,
  totalUsers,
  usersLastMonth,
  recentLeadsRaw,
  recentDealsRaw,
}) => {
  const stats = {
    totalLeads: {
      value: totalLeads,
      change: calcChange(totalLeads, leadsLastMonth),
      trend: totalLeads >= leadsLastMonth ? "up" : "down",
    },
    totalDeals: {
      value: totalDeals,
      change: calcChange(totalDeals, dealsLastMonth),
      trend: totalDeals >= dealsLastMonth ? "up" : "down",
    },
    totalOrganizations: {
      value: totalOrganizations,
      change: calcChange(totalOrganizations, orgsLastMonth),
      trend: totalOrganizations >= orgsLastMonth ? "up" : "down",
    },
    totalUsers: {
      value: totalUsers,
      change: calcChange(totalUsers, usersLastMonth),
      trend: totalUsers >= usersLastMonth ? "up" : "down",
    },
  };

  const recentLeads = recentLeadsRaw.map((lead) => ({
    _id: lead._id,
    name: `${lead.firstName} ${lead.lastName || ""}`.trim(),
    email: lead.email,
    organization: lead.orgName || "",
    score: lead.score || 0,
    updatedAt: formatDate(new Date(lead.updatedAt), "yyyy-MM-dd"),
  }));

  const recentDeals = recentDealsRaw.map((deal) => ({
    _id: deal._id,
    title: deal.name,
    value: deal.value || 0,
    status: getDealStatus(deal.probability || 0),
    updatedAt: formatDate(new Date(deal.updatedAt), "yyyy-MM-dd"),
  }));

  return { stats, recentLeads, recentDeals };
};

export const calcTenantDashboardStats = ({
  totalTenants,
  tenantsLastMonth,
  totalUsers,
  usersLastMonth,
  planCounts,
  lastMonthPlanCounts,
  recentTenantsRaw,
  planPrices,
}) => {
  const currentRevenue = planCounts.reduce(
    (sum, p) => sum + (planPrices[p._id] || 0) * p.count,
    0,
  );
  const lastMonthRevenue = lastMonthPlanCounts.reduce(
    (sum, p) => sum + (planPrices[p._id] || 0) * p.count,
    0,
  );

  const paidPlans = planCounts
    .filter((p) => p._id !== "free")
    .reduce((sum, p) => sum + p.count, 0);
  const lastMonthPaidPlans = lastMonthPlanCounts
    .filter((p) => p._id !== "free")
    .reduce((sum, p) => sum + p.count, 0);

  const stats = {
    totalTenants: {
      value: totalTenants,
      change: calcChange(totalTenants, tenantsLastMonth),
      trend: totalTenants >= tenantsLastMonth ? "up" : "down",
    },
    totalUsers: {
      value: totalUsers,
      change: calcChange(totalUsers, usersLastMonth),
      trend: totalUsers >= usersLastMonth ? "up" : "down",
    },
    monthlyRevenue: {
      value: currentRevenue,
      change: calcChange(currentRevenue, lastMonthRevenue),
      trend: currentRevenue >= lastMonthRevenue ? "up" : "down",
    },
    paidPlans: {
      value: paidPlans,
      change: calcChange(paidPlans, lastMonthPaidPlans),
      trend: paidPlans >= lastMonthPaidPlans ? "up" : "down",
    },
  };

  const recentTenants = recentTenantsRaw.map((t) => ({
    _id: t._id,
    name: t.name,
    email: t.email,
    plan: t.plan,
    city: t.address?.city || "",
    country: t.address?.country || "",
    createdAt: formatDate(new Date(t.createdAt), "yyyy-MM-dd"),
  }));

  const planDistribution = planCounts.map((p) => ({
    plan: p._id,
    count: p.count,
  }));

  return { stats, recentTenants, planDistribution };
};
