import { Lead } from "../models/lead.model.js";
import { Deal } from "../models/deal.model.js";
import { Organization } from "../models/organization.model.js";
import { User } from "../models/user.model.js";
import { WorkerService } from "./worker.service.js";

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

  return WorkerService.run("calcDashboardStats", {
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
  });
};
