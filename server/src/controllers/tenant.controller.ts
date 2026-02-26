import { Request, Response } from "express";
import {
  fetchTenantDashboardStatsService,
  fetchTenantsService,
  fetchTenantByIdService,
  createTenantService,
  updateTenantByIdService,
  deleteTenantByIdService,
  createUserForTenantService,
  fetchUsersByTenantIdService,
} from "../services/tenant.service";
import { AppError } from "../shared/app-error";
import { sendSuccess } from "../shared/api-response";
import { asyncHandler } from "../shared/async-handler";

export const getTenantDashboardStats = asyncHandler(
  async (req: Request, res: Response) => {
    const { stats, recentTenants, planDistribution } =
      await fetchTenantDashboardStatsService();

    sendSuccess(res, 200, "Tenant dashboard stats retrieved successfully", {
      stats,
      recentTenants,
      planDistribution,
    });
  },
);

export const getAllTenants = asyncHandler(
  async (req: Request, res: Response) => {
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
  },
);

export const getTenantById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      throw new AppError("Tenant ID is required", 400);
    }

    const { tenant, usersCount } = await fetchTenantByIdService({ id });

    sendSuccess(res, 200, "Tenant retrieved successfully", {
      tenant,
      usersCount,
    });
  },
);

export const getUsersByTenantId = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      throw new AppError("Tenant ID is required", 400);
    }

    const search = req.query.search;

    const { users } = await fetchUsersByTenantIdService({
      tenantId: id,
      search,
    });

    sendSuccess(res, 200, "Tenant users retrieved successfully", { users });
  },
);

export const createTenant = asyncHandler(
  async (req: Request, res: Response) => {
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
  },
);

export const updateTenantById = asyncHandler(
  async (req: Request, res: Response) => {
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
  },
);

export const deleteTenantById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
      throw new AppError("Tenant ID is required", 400);
    }

    const deleted = await deleteTenantByIdService({ id });
    if (!deleted) {
      throw new AppError("Tenant not found", 404);
    }

    sendSuccess(res, 200, "Tenant deleted successfully", { id });
  },
);

export const createUserForTenant = asyncHandler(
  async (req: Request, res: Response) => {
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
  },
);
