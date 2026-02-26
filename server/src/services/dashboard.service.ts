import { format } from "date-fns";
import { Lead } from "../models/lead.model.js";
import { Deal } from "../models/deal.model.js";
import { Organization } from "../models/organization.model.js";
import { User } from "../models/user.model.js";
import { calcChange, getDealStatus } from "../utils/stats-helper.js";
import { FetchDashboardStatsInput } from "../types/services/dashboard.service.types";

export const fetchDashboardStatsService = async ({
  tenantId,
}: FetchDashboardStatsInput) => {
  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [leadAgg, dealAgg, orgAgg, userAgg] = await Promise.all([
    Lead.aggregate([
      { $match: { tenantId } },
      {
        $facet: {
          total: [{ $count: "count" }],
          lastMonth: [
            { $match: { createdAt: { $lt: startOfThisMonth } } },
            { $count: "count" },
          ],
          recent: [
            { $sort: { createdAt: -1 } },
            { $limit: 5 },
            {
              $project: {
                _id: 1,
                firstName: 1,
                lastName: 1,
                email: 1,
                orgName: 1,
                score: 1,
                updatedAt: 1,
              },
            },
          ],
        },
      },
    ]),
    Deal.aggregate([
      { $match: { tenantId } },
      {
        $facet: {
          total: [{ $count: "count" }],
          lastMonth: [
            { $match: { createdAt: { $lt: startOfThisMonth } } },
            { $count: "count" },
          ],
          recent: [
            { $sort: { createdAt: -1 } },
            { $limit: 5 },
            {
              $project: {
                _id: 1,
                name: 1,
                value: 1,
                probability: 1,
                updatedAt: 1,
              },
            },
          ],
        },
      },
    ]),
    Organization.aggregate([
      { $match: { tenantId } },
      {
        $facet: {
          total: [{ $count: "count" }],
          lastMonth: [
            { $match: { createdAt: { $lt: startOfThisMonth } } },
            { $count: "count" },
          ],
        },
      },
    ]),
    User.aggregate([
      { $match: { tenantId } },
      {
        $facet: {
          total: [{ $count: "count" }],
          lastMonth: [
            { $match: { createdAt: { $lt: startOfThisMonth } } },
            { $count: "count" },
          ],
        },
      },
    ]),
  ]);

  const totalLeads = leadAgg[0].total[0]?.count ?? 0;
  const leadsLastMonth = leadAgg[0].lastMonth[0]?.count ?? 0;
  const totalDeals = dealAgg[0].total[0]?.count ?? 0;
  const dealsLastMonth = dealAgg[0].lastMonth[0]?.count ?? 0;
  const totalOrganizations = orgAgg[0].total[0]?.count ?? 0;
  const orgsLastMonth = orgAgg[0].lastMonth[0]?.count ?? 0;
  const totalUsers = userAgg[0].total[0]?.count ?? 0;
  const usersLastMonth = userAgg[0].lastMonth[0]?.count ?? 0;

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

  const recentLeads = leadAgg[0].recent.map((lead) => ({
    _id: lead._id,
    name: `${lead.firstName} ${lead.lastName || ""}`.trim(),
    email: lead.email,
    organization: lead.orgName || "",
    score: lead.score || 0,
    updatedAt: format(new Date(lead.updatedAt), "yyyy-MM-dd"),
  }));

  const recentDeals = dealAgg[0].recent.map((deal) => ({
    _id: deal._id,
    title: deal.name,
    value: deal.value || 0,
    status: getDealStatus(deal.probability || 0),
    updatedAt: format(new Date(deal.updatedAt), "yyyy-MM-dd"),
  }));

  return { stats, recentLeads, recentDeals };
};
