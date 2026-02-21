import { formatDate } from "date-fns";
import { Lead } from "../models/lead.model.js";
import { Deal } from "../models/deal.model.js";
import { Organization } from "../models/organization.model.js";
import { User } from "../models/user.model.js";
import { calcChange, getDealStatus } from "../utils/stats-helper.js";

export const fetchDashboardStatsService = async ({ tenantId }) => {
  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
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
  ] = await Promise.all([
    Lead.countDocuments({ tenantId }),
    Lead.countDocuments({ tenantId, createdAt: { $lt: startOfThisMonth } }),
    Deal.countDocuments({ tenantId }),
    Deal.countDocuments({ tenantId, createdAt: { $lt: startOfThisMonth } }),
    Organization.countDocuments({ tenantId }),
    Organization.countDocuments({
      tenantId,
      createdAt: { $lt: startOfThisMonth },
    }),
    User.countDocuments({ tenantId }),
    User.countDocuments({ tenantId, createdAt: { $lt: startOfThisMonth } }),
    Lead.find({ tenantId }).sort({ createdAt: -1 }).limit(5).lean().exec(),
    Deal.find({ tenantId }).sort({ createdAt: -1 }).limit(5).lean().exec(),
  ]);

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
    updatedAt: formatDate(lead.updatedAt, "yyyy-MM-dd"),
  }));

  const recentDeals = recentDealsRaw.map((deal) => ({
    _id: deal._id,
    title: deal.name,
    value: deal.value || 0,
    status: getDealStatus(deal.probability || 0),
    updatedAt: formatDate(deal.updatedAt, "yyyy-MM-dd"),
  }));

  return { stats, recentLeads, recentDeals };
};
