import { randomBytes } from "node:crypto";
import mongoose from "mongoose";
import { formatDate } from "date-fns";
import { Tenant } from "../models/tenant.model.js";
import { User } from "../models/user.model.js";
import { hashPassword } from "../utils/auth/bcrypt.js";
import { AppError } from "../utils/app-error.js";
import { PLAN_PRICES } from "../utils/plans.js";
import { WorkerService } from "./worker.service.js";

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
    User.countDocuments({ role: { $ne: "super_admin" } }),
    User.countDocuments({
      role: { $ne: "super_admin" },
      createdAt: { $lt: startOfThisMonth },
    }),
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

  return WorkerService.run("calcTenantDashboardStats", {
    totalTenants,
    tenantsLastMonth,
    totalUsers,
    usersLastMonth,
    planCounts,
    lastMonthPlanCounts,
    recentTenantsRaw,
    planPrices: PLAN_PRICES,
  });
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

export const fetchUsersByTenantIdService = async ({ tenantId }) => {
  const users = await User.find({ tenantId }).exec();

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
}) => {
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
    const tempPassword = "Asdf@1234";
    const hashedPassword = await hashPassword(tempPassword);

    console.log(
      `Creating admin user for tenant ${createdTenant._id} with email ${email} and temp password ${tempPassword}`,
    );

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
    lastName: name.split(" ").slice(1).join(" ") || "",
    email,
    mobile: mobile || "",
    password: hashedPassword,
    role,
  });
};
