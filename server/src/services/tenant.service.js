import { formatDate } from "date-fns";
import { Tenant } from "../models/tenant.model.js";
import { User } from "../models/user.model.js";
import { hashPassword } from "../utils/auth/bcrypt.js";
import { AppError } from "../utils/app-error.js";

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
    Tenant.find(whereQuery).sort({ _id: 1 }).limit(limit).exec(),
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
