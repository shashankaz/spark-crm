import mongoose from "mongoose";
import { formatDate } from "date-fns";
import { Tenant } from "../models/tenant.model";
import { User } from "../models/user.model";
import { hashPassword } from "../utils/auth/bcrypt";
import { AppError } from "../shared/app-error";
import { PLAN_PRICES } from "../utils/plans";
import { calcChange } from "../utils/stats-helper";
import { sendAdminMail, sendUserWelcomeMail } from "./email.service";
import {
  FetchTenantsInput,
  FetchTenantByIdInput,
  FetchUsersByTenantIdInput,
  CreateTenantInput,
  UpdateTenantByIdInput,
  DeleteTenantByIdInput,
  CreateUserForTenantInput,
} from "../types/services/tenant.service.types";
import { TenantDocument, TenantPlan } from "../types/models/tenant.model.types";

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
    ]),
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
    ]),
  ]);

  const totalTenants = tenantAgg[0].total[0]?.count ?? 0;
  const tenantsLastMonth = tenantAgg[0].lastMonth[0]?.count ?? 0;
  const planCounts = tenantAgg[0].planCounts;
  const lastMonthPlanCounts = tenantAgg[0].lastMonthPlanCounts;
  const totalUsers = userAgg[0].total[0]?.count ?? 0;
  const usersLastMonth = userAgg[0].lastMonth[0]?.count ?? 0;

  const currentRevenue = planCounts.reduce(
    (sum: number, p) =>
      sum + (PLAN_PRICES[p._id as keyof typeof PLAN_PRICES] || 0) * p.count,
    0,
  );
  const lastMonthRevenue = lastMonthPlanCounts.reduce(
    (sum: number, p) =>
      sum + (PLAN_PRICES[p._id as keyof typeof PLAN_PRICES] || 0) * p.count,
    0,
  );

  const paidPlans = planCounts
    .filter((p) => p._id !== "free")
    .reduce((sum: number, p) => sum + p.count, 0);
  const lastMonthPaidPlans = lastMonthPlanCounts
    .filter((p) => p._id !== "free")
    .reduce((sum: number, p) => sum + p.count, 0);

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

  const recentTenants = tenantAgg[0].recent.map((t: TenantDocument) => ({
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

export const fetchTenantsService = async ({
  cursor,
  limit,
  search,
}: FetchTenantsInput) => {
  const countQuery: any = { isDeleted: false };
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

export const fetchTenantByIdService = async ({ id }: FetchTenantByIdInput) => {
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
}: FetchUsersByTenantIdInput) => {
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

export const createTenantService = async ({
  name,
  gstNumber,
  panNumber,
  email,
  mobile,
  address,
  plan,
}: CreateTenantInput) => {
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
  gstNumber,
  panNumber,
  email,
  mobile,
  address,
  plan,
}: UpdateTenantByIdInput) => {
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
  tenant.plan = (plan as TenantPlan) || tenant.plan;

  const updated = await tenant.save();

  return updated;
};

export const deleteTenantByIdService = async ({
  id,
}: DeleteTenantByIdInput) => {
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
}: CreateUserForTenantInput) => {
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
