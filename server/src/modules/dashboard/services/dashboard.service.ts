import { format } from "date-fns";
import { Lead } from "../../lead/models/lead.model";
import { Deal } from "../../deal/models/deal.model";
import { Organization } from "../../organization/models/organization.model";
import { User } from "../../user/models/user.model";
import { Call } from "../../call/models/call.model";
import { calcChange, getDealStatus } from "../../../utils/stats-helper";
import { FetchDashboardStatsInput } from "./dashboard.service.types";
import { LeadDocument } from "../../lead/models/lead.model.types";
import { DealDocument } from "../../deal/models/deal.model.types";
import { MONTHS } from "../../../utils/constants/months.constant";

export const fetchDashboardStatsService = async ({
  tenantId,
  userId,
  role,
}: FetchDashboardStatsInput) => {
  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const baseMatch: Record<string, any> = { tenantId };
  if (role === "user") baseMatch.userId = userId;

  const [leadAgg, dealAgg, orgAgg, userAgg] = await Promise.all([
    Lead.aggregate([
      { $match: baseMatch },
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
    ]).allowDiskUse(true),

    Deal.aggregate([
      { $match: baseMatch },
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
    ]).allowDiskUse(true),

    Organization.aggregate([
      { $match: baseMatch },
      {
        $facet: {
          total: [{ $count: "count" }],
          lastMonth: [
            { $match: { createdAt: { $lt: startOfThisMonth } } },
            { $count: "count" },
          ],
        },
      },
    ]).allowDiskUse(true),

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
    ]).allowDiskUse(true),
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

  const recentLeads = leadAgg[0].recent.map((lead: LeadDocument) => ({
    _id: lead._id,
    name: `${lead.firstName} ${lead.lastName || ""}`.trim(),
    email: lead.email,
    organization: lead.orgName || "",
    score: lead.score || 0,
    updatedAt: format(new Date(lead.updatedAt), "yyyy-MM-dd"),
  }));

  const recentDeals = dealAgg[0].recent.map((deal: DealDocument) => ({
    _id: deal._id,
    title: deal.name,
    value: deal.value || 0,
    status: getDealStatus(deal.probability || 0),
    updatedAt: format(new Date(deal.updatedAt), "yyyy-MM-dd"),
  }));

  return { stats, recentLeads, recentDeals };
};

export const fetchCallActivityService = async ({
  tenantId,
  userId,
  role,
}: FetchDashboardStatsInput) => {
  const now = new Date();
  const since = new Date(now.getFullYear() - 1, now.getMonth() + 1, 1);

  const leadMatch: Record<string, any> = { "lead.tenantId": tenantId };
  if (role === "user") leadMatch["lead.userId"] = userId;

  const result = await Call.aggregate([
    { $match: { createdAt: { $gte: since } } },
    {
      $lookup: {
        from: "leads",
        localField: "leadId",
        foreignField: "_id",
        as: "lead",
      },
    },
    { $unwind: "$lead" },
    { $match: leadMatch },
    {
      $group: {
        _id: { month: { $month: "$createdAt" }, type: "$type" },
        count: { $sum: 1 },
      },
    },
  ]).allowDiskUse(true);

  const data = MONTHS.map((month, index) => {
    const monthNum = index + 1;
    const inbound =
      result.find(
        (r: any) => r._id.month === monthNum && r._id.type === "inbound",
      )?.count ?? 0;
    const outbound =
      result.find(
        (r: any) => r._id.month === monthNum && r._id.type === "outbound",
      )?.count ?? 0;
    return { month, inbound, outbound };
  });

  return { data };
};

export const fetchConversionFunnelService = async ({
  tenantId,
  userId,
  role,
}: FetchDashboardStatsInput) => {
  const now = new Date();
  const since = new Date(now.getFullYear() - 1, now.getMonth() + 1, 1);

  const baseMatch: Record<string, any> = {
    tenantId,
    createdAt: { $gte: since },
  };
  if (role === "user") baseMatch.userId = userId;

  const [leadCounts, wonDeals] = await Promise.all([
    Lead.aggregate([
      { $match: baseMatch },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]).allowDiskUse(true),
    Deal.countDocuments({
      ...baseMatch,
      probability: { $gte: 100 },
    }),
  ]);

  const get = (status: string) =>
    leadCounts.find((l: any) => l._id === status)?.count ?? 0;
  const total = leadCounts.reduce((sum: number, l: any) => sum + l.count, 0);

  const data = [
    { stage: "Leads", count: total },
    {
      stage: "Contacted",
      count: get("contacted") + get("qualified") + get("converted"),
    },
    { stage: "Qualified", count: get("qualified") + get("converted") },
    { stage: "Proposal", count: get("converted") },
    { stage: "Closed", count: wonDeals },
  ];

  return { data };
};

export const fetchDealPipelineService = async ({
  tenantId,
  userId,
  role,
}: FetchDashboardStatsInput) => {
  const now = new Date();
  const since = new Date(now.getFullYear() - 1, now.getMonth() + 1, 1);

  const baseMatch: Record<string, any> = {
    tenantId,
    createdAt: { $gte: since },
  };
  if (role === "user") baseMatch.userId = userId;

  const result = await Deal.aggregate([
    { $match: baseMatch },
    {
      $bucket: {
        groupBy: "$value",
        boundaries: [0, 5000, 20000, 50000, 100000],
        default: "100k+",
        output: { count: { $sum: 1 }, value: { $sum: "$value" } },
      },
    },
  ]).allowDiskUse(true);

  const rangeLabels: Record<string, string> = {
    "0": "$0-5k",
    "5000": "$5-20k",
    "20000": "$20-50k",
    "50000": "$50-100k",
    "100k+": "$100k+",
  };

  const data = result.map((r: any) => ({
    range: rangeLabels[String(r._id)] ?? String(r._id),
    count: r.count,
    value: r.value,
  }));

  return { data };
};

export const fetchDealWinRateService = async ({
  tenantId,
  userId,
  role,
}: FetchDashboardStatsInput) => {
  const now = new Date();
  const since = new Date(now.getFullYear() - 1, now.getMonth() + 1, 1);

  const baseMatch: Record<string, any> = {
    tenantId,
    createdAt: { $gte: since },
  };
  if (role === "user") baseMatch.userId = userId;

  const [agg] = await Deal.aggregate([
    { $match: baseMatch },
    {
      $facet: {
        won: [{ $match: { probability: { $gte: 100 } } }, { $count: "count" }],
        lost: [{ $match: { probability: { $lte: 0 } } }, { $count: "count" }],
        inProgress: [
          { $match: { probability: { $gt: 0, $lt: 100 } } },
          { $count: "count" },
        ],
      },
    },
  ]).allowDiskUse(true);

  const data = [
    { name: "Closed Won", value: agg.won[0]?.count ?? 0 },
    { name: "In Progress", value: agg.inProgress[0]?.count ?? 0 },
    { name: "Closed Lost", value: agg.lost[0]?.count ?? 0 },
  ];

  return { data };
};

export const fetchLeadScoreService = async ({
  tenantId,
  userId,
  role,
}: FetchDashboardStatsInput) => {
  const now = new Date();
  const since = new Date(now.getFullYear() - 1, now.getMonth() + 1, 1);

  const baseMatch: Record<string, any> = {
    tenantId,
    createdAt: { $gte: since },
  };
  if (role === "user") baseMatch.userId = userId;

  const result = await Lead.aggregate([
    { $match: baseMatch },
    {
      $bucket: {
        groupBy: "$score",
        boundaries: [0, 26, 51, 76, 101],
        default: "other",
        output: { count: { $sum: 1 } },
      },
    },
  ]).allowDiskUse(true);

  const rangeLabels: Record<number, string> = {
    0: "0-25",
    26: "26-50",
    51: "51-75",
    76: "76-100",
  };

  const data = result
    .filter((r: any) => typeof r._id === "number")
    .map((r: any) => ({
      range: rangeLabels[r._id as number] ?? String(r._id),
      count: r.count,
    }));

  return { data };
};

export const fetchLeadSourcesService = async ({
  tenantId,
  userId,
  role,
}: FetchDashboardStatsInput) => {
  const now = new Date();
  const since = new Date(now.getFullYear() - 1, now.getMonth() + 1, 1);

  const baseMatch: Record<string, any> = {
    tenantId,
    createdAt: { $gte: since },
  };
  if (role === "user") baseMatch.userId = userId;

  const result = await Lead.aggregate([
    { $match: baseMatch },
    {
      $group: {
        _id: { $ifNull: ["$source", "other"] },
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]).allowDiskUse(true);

  const data = result.map((r: any) => ({ source: r._id, count: r.count }));

  return { data };
};

export const fetchLeadStatusService = async ({
  tenantId,
  userId,
  role,
}: FetchDashboardStatsInput) => {
  const now = new Date();
  const since = new Date(now.getFullYear() - 1, now.getMonth() + 1, 1);

  const baseMatch: Record<string, any> = {
    tenantId,
    createdAt: { $gte: since },
  };
  if (role === "user") baseMatch.userId = userId;

  const result = await Lead.aggregate([
    { $match: baseMatch },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]).allowDiskUse(true);

  const statusOrder = ["new", "contacted", "qualified", "converted", "lost"];
  const data = statusOrder.map((status) => ({
    status: status.charAt(0).toUpperCase() + status.slice(1),
    count: result.find((r: any) => r._id === status)?.count ?? 0,
  }));

  return { data };
};

export const fetchMonthlyRevenueService = async ({
  tenantId,
  userId,
  role,
}: FetchDashboardStatsInput) => {
  const now = new Date();
  const since = new Date(now.getFullYear() - 1, now.getMonth() + 1, 1);

  const baseMatch: Record<string, any> = {
    tenantId,
    createdAt: { $gte: since },
  };
  if (role === "user") baseMatch.userId = userId;

  const result = await Deal.aggregate([
    { $match: baseMatch },
    {
      $group: {
        _id: { $month: "$createdAt" },
        revenue: { $sum: "$value" },
        deals: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]).allowDiskUse(true);

  const data = MONTHS.map((month, index) => {
    const monthData = result.find((r: any) => r._id === index + 1);
    return {
      month,
      revenue: monthData?.revenue ?? 0,
      deals: monthData?.deals ?? 0,
    };
  });

  return { data };
};

export const fetchOrgIndustryService = async ({
  tenantId,
  userId,
  role,
}: FetchDashboardStatsInput) => {
  const now = new Date();
  const since = new Date(now.getFullYear() - 1, now.getMonth() + 1, 1);

  const baseMatch: Record<string, any> = {
    tenantId,
    createdAt: { $gte: since },
  };
  if (role === "user") baseMatch.userId = userId;

  const result = await Organization.aggregate([
    { $match: baseMatch },
    {
      $group: {
        _id: { $ifNull: ["$industry", "other"] },
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]).allowDiskUse(true);

  const data = result.map((r: any) => ({ industry: r._id, count: r.count }));

  return { data };
};

export const fetchRevenueTargetService = async ({
  tenantId,
  userId,
  role,
}: FetchDashboardStatsInput) => {
  const now = new Date();
  const since = new Date(now.getFullYear() - 1, now.getMonth() + 1, 1);

  const baseMatch: Record<string, any> = {
    tenantId,
    probability: { $gte: 100 },
    createdAt: { $gte: since },
  };
  if (role === "user") baseMatch.userId = userId;

  const result = await Deal.aggregate([
    { $match: baseMatch },
    {
      $group: {
        _id: { $month: "$createdAt" },
        actual: { $sum: "$value" },
      },
    },
    { $sort: { _id: 1 } },
  ]).allowDiskUse(true);

  const data = MONTHS.map((month, index) => {
    const monthData = result.find((r: any) => r._id === index + 1);
    return {
      month,
      actual: monthData?.actual ?? 0,
    };
  });

  return { data };
};
