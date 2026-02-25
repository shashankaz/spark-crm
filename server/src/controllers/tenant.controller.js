import {
  fetchTenantDashboardStatsService,
  fetchTenantsService,
  fetchTenantByIdService,
  createTenantService,
  updateTenantByIdService,
  deleteTenantByIdService,
  createUserForTenantService,
  fetchUsersByTenantIdService,
} from "../services/tenant.service.js";
import { AppError } from "../shared/app-error.js";
import { sendSuccess } from "../shared/api-response.js";

export const getTenantDashboardStats = async (req, res, next) => {
  try {
    const { stats, recentTenants, planDistribution } =
      await fetchTenantDashboardStatsService();

    sendSuccess(res, 200, "Tenant dashboard stats retrieved successfully", {
      stats,
      recentTenants,
      planDistribution,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllTenants = async (req, res, next) => {
  try {
    const cursor = req.query.cursor;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search;

    const { tenants, totalCount } = await fetchTenantsService({
      cursor,
      limit,
      search,
    });

    sendSuccess(res, 200, "Tenants retrieved successfully", {
      tenants,
      totalCount,
    });
  } catch (error) {
    next(error);
  }
};

export const getTenantById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new AppError("Tenant ID is required", 400);
    }

    const { tenant, usersCount } = await fetchTenantByIdService({ id });

    sendSuccess(res, 200, "Tenant retrieved successfully", {
      tenant,
      usersCount,
    });
  } catch (error) {
    next(error);
  }
};

export const getUsersByTenantId = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new AppError("Tenant ID is required", 400);
    }

    const { users } = await fetchUsersByTenantIdService({ tenantId: id });

    sendSuccess(res, 200, "Tenant users retrieved successfully", { users });
  } catch (error) {
    next(error);
  }
};

export const createTenant = async (req, res, next) => {
  try {
    const { name, gstNumber, panNumber, email, mobile, address, plan } =
      req.body;
    if (!name || !email || !mobile || !plan) {
      throw new AppError("Name, Email, Mobile, and Plan are required", 400);
    }

    const tenant = await createTenantService({
      name,
      gstNumber,
      panNumber,
      email,
      mobile,
      address,
      plan,
    });
    if (!tenant) {
      throw new AppError("Failed to create tenant", 400);
    }

    sendSuccess(res, 201, "Tenant created successfully", { tenant });
  } catch (error) {
    next(error);
  }
};

export const updateTenantById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new AppError("Tenant ID is required", 400);
    }

    const { name, gstNumber, panNumber, email, mobile, address, plan } =
      req.body;
    if (!name && !email && !mobile) {
      throw new AppError(
        "At least one field (name, email, mobile) is required to update",
        400,
      );
    }

    const updatedTenant = await updateTenantByIdService({
      id,
      name,
      gstNumber,
      panNumber,
      email,
      mobile,
      address,
      plan,
    });

    if (!updatedTenant) {
      throw new AppError("Tenant not found", 404);
    }

    sendSuccess(res, 200, "Tenant updated successfully", { updatedTenant });
  } catch (error) {
    next(error);
  }
};

export const deleteTenantById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new AppError("Tenant ID is required", 400);
    }

    const deleted = await deleteTenantByIdService({ id });
    if (!deleted) {
      throw new AppError("Tenant not found", 404);
    }

    sendSuccess(res, 200, "Tenant deleted successfully", { id });
  } catch (error) {
    next(error);
  }
};

export const createUserForTenant = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new AppError("Tenant ID is required", 400);
    }

    const { name, email, mobile, password, role } = req.body;
    if (!name || !email || !password || !role) {
      throw new AppError("Name, Email, Password, and Role are required", 400);
    }

    const user = await createUserForTenantService({
      tenantId: id,
      name,
      email,
      mobile,
      password,
      role,
    });
    if (!user) {
      throw new AppError("Failed to create user for tenant", 400);
    }

    sendSuccess(res, 200, "Tenant user created successfully", { user });
  } catch (error) {
    next(error);
  }
};
