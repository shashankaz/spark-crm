import mongoose from "mongoose";
import { formatDate } from "date-fns";
import { Tenant } from "../models/tenant.model";
import { User } from "../../user/models/user.model";
import { hashPassword } from "../../../utils/auth/bcrypt";
import { AppError } from "../../../shared/app-error";
import { PLAN_PRICES } from "../../../utils/constants/plans.constant";
import { calcChange } from "../../../utils/stats-helper";
import {
  sendAdminMail,
  sendUserWelcomeMail,
} from "../../../utils/mail/email.helper";
import {
  IFetchTenantsInput,
  IFetchTenantByIdInput,
  IFetchUsersByTenantIdInput,
  ICreateTenantInput,
  IUpdateTenantByIdInput,
  IDeleteTenantByIdInput,
  ICreateUserForTenantInput,
  ICheckSlugAvailabilityInput,
} from "./tenant.service.types";
import { ITenantDocument, TenantPlan } from "../models/tenant.model.types";
import { MONTHS } from "../../../utils/constants/months.constant";

const tempPasswordGlobal = "Asdf@1234";

export const fetchTenantDashboardStatsService = async () => {
  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [tenantAgg, userAgg] = await Promise.all([
    Tenant.aggregate([
      { $match: { isDeleted: false } },
      {
        $facet: {
          total: [{ $count: "count" }],
          lastMonth: [
            { $match: { createdAt: { $lt: startOfThisMonth } } },
            { $count: "count" },
          ],
          planCounts: [{ $group: { _id: "$plan", count: { $sum: 1 } } }],
          lastMonthPlanCounts: [
            { $match: { createdAt: { $lt: startOfThisMonth } } },
            { $group: { _id: "$plan", count: { $sum: 1 } } },
          ],
          recent: [
            { $sort: { createdAt: -1 } },
            { $limit: 5 },
            {
              $project: {
                _id: 1,
                name: 1,
                email: 1,
                plan: 1,
                address: 1,
                createdAt: 1,
              },
            },
          ],
        },
      },
    ]).allowDiskUse(true),

    User.aggregate([
      { $match: { role: { $ne: "super_admin" } } },
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

  const totalTenants = tenantAgg[0].total[0]?.count ?? 0;
  const tenantsLastMonth = tenantAgg[0].lastMonth[0]?.count ?? 0;
  const planCounts = tenantAgg[0].planCounts;
  const lastMonthPlanCounts = tenantAgg[0].lastMonthPlanCounts;
  const totalUsers = userAgg[0].total[0]?.count ?? 0;
  const usersLastMonth = userAgg[0].lastMonth[0]?.count ?? 0;

  const currentRevenue = planCounts.reduce(
    (sum: number, p: { _id: string; count: number }) =>
      sum + (PLAN_PRICES[p._id as keyof typeof PLAN_PRICES] || 0) * p.count,
    0,
  );
  const lastMonthRevenue = lastMonthPlanCounts.reduce(
    (sum: number, p: { _id: string; count: number }) =>
      sum + (PLAN_PRICES[p._id as keyof typeof PLAN_PRICES] || 0) * p.count,
    0,
  );

  const paidPlans = planCounts
    .filter((p: { _id: string; count: number }) => p._id !== "free")
    .reduce(
      (sum: number, p: { _id: string; count: number }) => sum + p.count,
      0,
    );
  const lastMonthPaidPlans = lastMonthPlanCounts
    .filter((p: { _id: string; count: number }) => p._id !== "free")
    .reduce(
      (sum: number, p: { _id: string; count: number }) => sum + p.count,
      0,
    );

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

  const recentTenants = tenantAgg[0].recent.map((t: ITenantDocument) => ({
    _id: t._id,
    name: t.name,
    email: t.email,
    plan: t.plan,
    city: t.address?.city || "",
    country: t.address?.country || "",
    createdAt: formatDate(new Date(t.createdAt), "yyyy-MM-dd"),
  }));

  const planDistribution = planCounts.map(
    (p: { _id: string; count: number }) => ({
      plan: p._id,
      count: p.count,
    }),
  );

  return { stats, recentTenants, planDistribution };
};

export const fetchTenantGrowthService = async () => {
  const now = new Date();
  const since = new Date(now.getFullYear() - 1, now.getMonth() + 1, 1);

  const result = await Tenant.aggregate([
    { $match: { isDeleted: false, createdAt: { $gte: since } } },
    {
      $group: {
        _id: { $month: "$createdAt" },
        newTenants: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]).allowDiskUse(true);

  const data = MONTHS.map((month, index) => {
    const monthData = result.find((r: any) => r._id === index + 1);
    return {
      month,
      newTenants: monthData?.newTenants ?? 0,
    };
  });

  return { data };
};

export const fetchAdminRevenueService = async () => {
  const now = new Date();
  const since = new Date(now.getFullYear() - 1, now.getMonth() + 1, 1);

  const result = await Tenant.aggregate([
    { $match: { isDeleted: false, createdAt: { $gte: since } } },
    {
      $group: {
        _id: { month: { $month: "$createdAt" }, plan: "$plan" },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.month": 1 } },
  ]).allowDiskUse(true);

  const data = MONTHS.map((month, index) => {
    const monthNum = index + 1;
    const getRevenue = (plan: string) => {
      const entry = result.find(
        (r: any) => r._id.month === monthNum && r._id.plan === plan,
      );
      return (
        (PLAN_PRICES[plan as keyof typeof PLAN_PRICES] || 0) *
        (entry?.count ?? 0)
      );
    };

    return {
      month,
      free: getRevenue("free"),
      basic: getRevenue("basic"),
      pro: getRevenue("pro"),
      enterprise: getRevenue("enterprise"),
      total:
        getRevenue("free") +
        getRevenue("basic") +
        getRevenue("pro") +
        getRevenue("enterprise"),
    };
  });

  return { data };
};

export const fetchPlanDistributionChartService = async () => {
  const result = await Tenant.aggregate([
    { $match: { isDeleted: false } },
    { $group: { _id: "$plan", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]).allowDiskUse(true);

  const planOrder = ["free", "basic", "pro", "enterprise"];
  const data = planOrder.map((plan) => ({
    plan,
    count: result.find((r: any) => r._id === plan)?.count ?? 0,
    revenue:
      (PLAN_PRICES[plan as keyof typeof PLAN_PRICES] || 0) *
      (result.find((r: any) => r._id === plan)?.count ?? 0),
  }));

  return { data };
};

export const fetchUserGrowthService = async () => {
  const now = new Date();
  const since = new Date(now.getFullYear() - 1, now.getMonth() + 1, 1);

  const result = await User.aggregate([
    {
      $match: {
        role: { $ne: "super_admin" },
        createdAt: { $gte: since },
      },
    },
    {
      $group: {
        _id: { month: { $month: "$createdAt" }, role: "$role" },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.month": 1 } },
  ]).allowDiskUse(true);

  const data = MONTHS.map((month, index) => {
    const monthNum = index + 1;
    const getCount = (role: string) =>
      result.find((r: any) => r._id.month === monthNum && r._id.role === role)
        ?.count ?? 0;
    return {
      month,
      admin: getCount("admin"),
      user: getCount("user"),
      total: getCount("admin") + getCount("user"),
    };
  });

  return { data };
};

export const fetchTopTenantsByPlanService = async () => {
  const result = await Tenant.aggregate([
    { $match: { isDeleted: false } },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "tenantId",
        as: "users",
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        plan: 1,
        email: 1,
        userCount: { $size: "$users" },
        revenue: {
          $switch: {
            branches: [
              {
                case: { $eq: ["$plan", "basic"] },
                then: PLAN_PRICES.basic,
              },
              {
                case: { $eq: ["$plan", "pro"] },
                then: PLAN_PRICES.pro,
              },
              {
                case: { $eq: ["$plan", "enterprise"] },
                then: PLAN_PRICES.enterprise,
              },
            ],
            default: PLAN_PRICES.free,
          },
        },
      },
    },
    { $sort: { revenue: -1, userCount: -1 } },
    { $limit: 10 },
  ]).allowDiskUse(true);

  const data = result.map((r: any) => ({
    name: r.name,
    plan: r.plan,
    userCount: r.userCount,
    revenue: r.revenue,
  }));

  return { data };
};

export const fetchTenantsService = async ({
  cursor,
  limit,
  search,
  plan,
  country,
}: IFetchTenantsInput) => {
  const countQuery: any = { isDeleted: false };
  if (search) {
    countQuery.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  if (plan) {
    countQuery.plan = plan;
  }

  if (country) {
    countQuery["address.country"] = { $regex: country, $options: "i" };
  }

  const whereQuery = { ...countQuery };
  if (cursor) {
    whereQuery._id = { $gt: cursor };
  }

  const [totalCount, tenants] = await Promise.all([
    Tenant.countDocuments(countQuery).exec(),
    Tenant.find(whereQuery).sort({ createdAt: -1 }).limit(limit).exec(),
  ]);

  const formattedTenants = tenants.map((tenant) => ({
    _id: tenant._id,
    name: tenant.name,
    email: tenant.email,
    mobile: tenant.mobile,
    address: {
      country: tenant.address?.country || "",
    },
    plan: tenant.plan,
    updatedAt: formatDate(tenant.updatedAt, "dd/MM/yyyy"),
  }));

  return { tenants: formattedTenants, totalCount };
};

export const fetchTenantByIdService = async ({ id }: IFetchTenantByIdInput) => {
  const [tenant, usersCount] = await Promise.all([
    Tenant.findOne({ _id: id, isDeleted: false }).exec(),
    User.countDocuments({ tenantId: id }).exec(),
  ]);

  if (!tenant) {
    throw new AppError("Tenant not found", 404);
  }

  return {
    tenant,
    usersCount,
  };
};

export const fetchUsersByTenantIdService = async ({
  tenantId,
  search,
}: IFetchUsersByTenantIdInput) => {
  const whereQuery: any = { tenantId };
  if (search) {
    whereQuery.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const users = await User.find(whereQuery).exec();

  const formattedUsers = users.map((user) => ({
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    mobile: user.mobile,
    role: user.role,
    updatedAt: formatDate(user.updatedAt, "dd/MM/yyyy"),
  }));

  return {
    users: formattedUsers,
  };
};

export const checkSlugAvailabilityService = async ({
  slug,
}: ICheckSlugAvailabilityInput) => {
  const existingTenant = await Tenant.findOne({ slug }).exec();

  return !existingTenant;
};

export const createTenantService = async ({
  name,
  slug,
  gstNumber,
  panNumber,
  email,
  mobile,
  address,
  plan,
}: ICreateTenantInput) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const tenant = await Tenant.create(
      [
        {
          name,
          gstNumber: gstNumber || undefined,
          panNumber: panNumber || undefined,
          email,
          slug,
          mobile,
          address: {
            line1: address?.line1 || undefined,
            line2: address?.line2 || undefined,
            city: address?.city || undefined,
            state: address?.state || undefined,
            country: address?.country || undefined,
            postalCode: address?.postalCode || undefined,
          },
          plan,
        },
      ],
      { session },
    );

    const createdTenant = tenant[0];

    // const tempPassword = randomBytes(9).toString("base64");
    const hashedPassword = await hashPassword(tempPasswordGlobal);

    await User.create(
      [
        {
          tenantId: createdTenant._id,
          firstName: name.split(" ")[0],
          lastName: name.split(" ").slice(1).join(" ") || "",
          email,
          mobile: mobile || "",
          password: hashedPassword,
          role: "admin",
        },
      ],
      { session },
    );

    await session.commitTransaction();

    await sendAdminMail({ userEmail: email }, tempPasswordGlobal);

    return { tenant: createdTenant };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const updateTenantByIdService = async ({
  id,
  name,
  slug,
  gstNumber,
  panNumber,
  email,
  mobile,
  address,
  plan,
}: IUpdateTenantByIdInput) => {
  const tenant = await Tenant.findOne({ _id: id, isDeleted: false }).exec();
  if (!tenant) {
    throw new AppError("Tenant not found", 404);
  }

  tenant.name = name || tenant.name;
  tenant.gstNumber = gstNumber || tenant.gstNumber;
  tenant.panNumber = panNumber || tenant.panNumber;
  tenant.email = email || tenant.email;
  tenant.slug = slug || tenant.slug;
  tenant.mobile = mobile || tenant.mobile;
  tenant.address = address || tenant.address;
  tenant.plan = (plan as TenantPlan) || tenant.plan;

  return await tenant.save();
};

export const deleteTenantByIdService = async ({
  id,
}: IDeleteTenantByIdInput) => {
  const tenant = await Tenant.findOne({ _id: id, isDeleted: false }).exec();
  if (!tenant) {
    throw new AppError("Tenant not found", 404);
  }

  tenant.isDeleted = true;
  tenant.deletedAt = new Date();

  return await tenant.save();
};

export const createUserForTenantService = async ({
  tenantId,
  name,
  email,
  mobile,
  password,
  role,
}: ICreateUserForTenantInput) => {
  const tenant = await Tenant.findOne({
    _id: tenantId,
    isDeleted: false,
  }).exec();
  if (!tenant) {
    throw new AppError("Tenant not found", 404);
  }

  const tempPassword = (password as string) || tempPasswordGlobal;
  const hashedPassword = await hashPassword(tempPassword);

  const newUser = await User.create({
    tenantId,
    firstName: name.split(" ")[0],
    lastName: name.split(" ").slice(1).join(" ") || "",
    email,
    mobile: mobile || "",
    password: hashedPassword,
    role,
  });

  await sendUserWelcomeMail({
    userEmail: email,
    userName: name.split(" ")[0],
    tempPassword,
  });

  return newUser;
};
