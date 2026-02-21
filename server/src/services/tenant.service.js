import { formatDate } from "date-fns";
import { Tenant } from "../models/tenant.model.js";
import { User } from "../models/user.model.js";
import { hashPassword } from "../utils/auth/bcrypt.js";
import { AppError } from "../utils/app-error.js";
import { PLAN_PRICES } from "../utils/plans.js";

const calcChange = (current, previous) => {
  if (previous === 0) return current > 0 ? "+100%" : "0%";
  const pct = Math.round(((current - previous) / previous) * 100);
  return pct >= 0 ? `+${pct}%` : `${pct}%`;
};

export const fetchTenantDashboardStatsService = async () => {
  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalTenants,
    tenantsLastMonth,
    totalUsers,
    usersLastMonth,
    planCounts,
    lastMonthPlanCounts,
    recentTenantsRaw,
  ] = await Promise.all([
    Tenant.countDocuments({ isDeleted: false }),
    Tenant.countDocuments({
      isDeleted: false,
      createdAt: { $lt: startOfThisMonth },
    }),
    User.countDocuments({}),
    User.countDocuments({ createdAt: { $lt: startOfThisMonth } }),
    Tenant.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: "$plan", count: { $sum: 1 } } },
    ]),
    Tenant.aggregate([
      { $match: { isDeleted: false, createdAt: { $lt: startOfThisMonth } } },
      { $group: { _id: "$plan", count: { $sum: 1 } } },
    ]),
    Tenant.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean()
      .exec(),
  ]);

  const currentRevenue = planCounts.reduce(
    (sum, p) => sum + (PLAN_PRICES[p._id] || 0) * p.count,
    0,
  );
  const lastMonthRevenue = lastMonthPlanCounts.reduce(
    (sum, p) => sum + (PLAN_PRICES[p._id] || 0) * p.count,
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
    createdAt: formatDate(t.createdAt, "yyyy-MM-dd"),
  }));

  const planDistribution = planCounts.map((p) => ({
    plan: p._id,
    count: p.count,
  }));

  return { stats, recentTenants, planDistribution };
};

export const fetchTenantsService = async ({ cursor, limit, search }) => {
  const countQuery = { isDeleted: false };
  if (search) {
    countQuery.name = { $regex: search, $options: "i" };
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

export const fetchTenantByIdService = async ({ id }) => {
  const [tenant, usersCount, users] = await Promise.all([
    Tenant.findOne({ _id: id, isDeleted: false }).exec(),
    User.countDocuments({ tenantId: id }).exec(),
    User.find({ tenantId: id }).exec(),
  ]);

  if (!tenant) {
    throw new AppError("Tenant not found", 404);
  }

  return {
    tenant,
    usersCount,
    users,
  };
};

export const createTenantService = ({
  name,
  gstNumber,
  panNumber,
  email,
  mobile,
  address,
  plan,
}) => {
  return Tenant.create({
    name,
    gstNumber,
    panNumber,
    email,
    mobile,
    address,
    plan,
  });
};

export const updateTenantByIdService = async ({
  id,
  name,
  gstNumber,
  panNumber,
  email,
  mobile,
  address,
  logoUrl,
  plan,
}) => {
  const tenant = await Tenant.findOne({ _id: id, isDeleted: false }).exec();
  if (!tenant) {
    throw new AppError("Tenant not found", 404);
  }

  tenant.name = name || tenant.name;
  tenant.gstNumber = gstNumber || tenant.gstNumber;
  tenant.panNumber = panNumber || tenant.panNumber;
  tenant.email = email || tenant.email;
  tenant.mobile = mobile || tenant.mobile;
  tenant.address = address || tenant.address;
  tenant.plan = plan || tenant.plan;

  return tenant.save();
};

export const deleteTenantByIdService = async ({ id }) => {
  const tenant = await Tenant.findOne({ _id: id, isDeleted: false }).exec();
  if (!tenant) {
    throw new AppError("Tenant not found", 404);
  }

  tenant.isDeleted = true;
  tenant.deletedAt = new Date();
  await tenant.save();

  return true;
};

export const createUserForTenantService = async ({
  tenantId,
  name,
  email,
  mobile,
  password,
  role,
}) => {
  const tenant = await Tenant.findOne({
    _id: tenantId,
    isDeleted: false,
  }).exec();
  if (!tenant) {
    throw new AppError("Tenant not found", 404);
  }

  const hashedPassword = await hashPassword(password);

  return User.create({
    tenantId,
    firstName: name.split(" ")[0],
    lastName: name.split(" ")[1] || "",
    email,
    mobile: mobile || "",
    password: hashedPassword,
    role,
  });
};
