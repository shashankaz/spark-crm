import { Request, Response } from "express";
import { Types } from "mongoose";
import {
  fetchTenantDashboardStatsService,
  fetchTenantsService,
  fetchTenantByIdService,
  createTenantService,
  updateTenantByIdService,
  deleteTenantByIdService,
  createUserForTenantService,
  fetchUsersByTenantIdService,
  checkSlugAvailabilityService,
  fetchTenantGrowthService,
  fetchAdminRevenueService,
  fetchPlanDistributionChartService,
  fetchUserGrowthService,
  fetchTopTenantsByPlanService,
} from "./services/tenant.service";
import { enqueueTenantExportService } from "../../utils/export/export.helper";
import { AppError } from "../../shared/app-error";
import { sendSuccess } from "../../shared/api-response";
import { asyncHandler } from "../../shared/async-handler";
import { validateEmailWithArcjet } from "../../utils/arcjet/validate-email";

export const getTenantDashboardStats = asyncHandler(
  async (_req: Request, res: Response) => {
    const { stats, recentTenants, planDistribution } =
      await fetchTenantDashboardStatsService();

    sendSuccess(res, 200, "Tenant dashboard stats retrieved successfully", {
      stats,
      recentTenants,
      planDistribution,
    });
  },
);

export const getTenantGrowth = asyncHandler(
  async (_req: Request, res: Response) => {
    const { data } = await fetchTenantGrowthService();

    sendSuccess(res, 200, "Tenant growth data retrieved successfully", {
      data,
    });
  },
);

export const getAdminRevenue = asyncHandler(
  async (_req: Request, res: Response) => {
    const { data } = await fetchAdminRevenueService();

    sendSuccess(res, 200, "Admin revenue data retrieved successfully", {
      data,
    });
  },
);

export const getPlanDistributionChart = asyncHandler(
  async (_req: Request, res: Response) => {
    const { data } = await fetchPlanDistributionChartService();

    sendSuccess(
      res,
      200,
      "Plan distribution chart data retrieved successfully",
      { data },
    );
  },
);

export const getUserGrowth = asyncHandler(
  async (_req: Request, res: Response) => {
    const { data } = await fetchUserGrowthService();

    sendSuccess(res, 200, "User growth data retrieved successfully", { data });
  },
);

export const getTopTenantsByPlan = asyncHandler(
  async (_req: Request, res: Response) => {
    const { data } = await fetchTopTenantsByPlanService();

    sendSuccess(res, 200, "Top tenants by plan retrieved successfully", {
      data,
    });
  },
);

export const getAllTenants = asyncHandler(
  async (req: Request, res: Response) => {
    const cursor = req.query.cursor as Types.ObjectId | undefined;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search as string | undefined;
    const plan = req.query.plan as string | undefined;
    const country = req.query.country as string | undefined;

    const { tenants, totalCount } = await fetchTenantsService({
      cursor,
      limit,
      search,
      plan,
      country,
    });

    sendSuccess(res, 200, "Tenants retrieved successfully", {
      tenants,
      totalCount,
    });
  },
);

export const getTenantById = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as unknown as Types.ObjectId;
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
    const id = req.params.id as unknown as Types.ObjectId;
    if (!id) {
      throw new AppError("Tenant ID is required", 400);
    }

    const search = req.query.search as string | undefined;

    const { users } = await fetchUsersByTenantIdService({
      tenantId: id,
      search,
    });

    sendSuccess(res, 200, "Tenant users retrieved successfully", { users });
  },
);

export const getAvailableSlug = asyncHandler(
  async (req: Request, res: Response) => {
    const slug = req.params.slug as string;
    if (!slug) {
      throw new AppError("Slug is required", 400);
    }

    const isAvailable = await checkSlugAvailabilityService({ slug });

    sendSuccess(res, 200, "Slug availability checked successfully", {
      isAvailable,
    });
  },
);

export const createTenant = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, slug, gstNumber, panNumber, email, mobile, address, plan } =
      req.body;
    if (!name || !slug || !email || !mobile || !plan) {
      throw new AppError(
        "Name, Slug, Email, Mobile, and Plan are required",
        400,
      );
    }

    const isDenied = await validateEmailWithArcjet({ req, email });
    if (isDenied) {
      throw new AppError("Invalid email address", 400);
    }

    const tenant = await createTenantService({
      name,
      slug,
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
    const id = req.params.id as unknown as Types.ObjectId;
    if (!id) {
      throw new AppError("Tenant ID is required", 400);
    }

    const { name, slug, gstNumber, panNumber, email, mobile, address, plan } =
      req.body;

    if (email) {
      const isDenied = await validateEmailWithArcjet({ req, email });
      if (isDenied) {
        throw new AppError("Invalid email address", 400);
      }
    }

    const updatedTenant = await updateTenantByIdService({
      id,
      name,
      slug,
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
    const id = req.params.id as unknown as Types.ObjectId;
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
    const id = req.params.id as unknown as Types.ObjectId;
    if (!id) {
      throw new AppError("Tenant ID is required", 400);
    }

    const { name, email, mobile, password, role } = req.body;
    if (!name || !email || !password || !role) {
      throw new AppError("Name, Email, Password, and Role are required", 400);
    }

    const isDenied = await validateEmailWithArcjet({ req, email });
    if (isDenied) {
      throw new AppError("Invalid email address", 400);
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

export const exportTenants = asyncHandler(
  async (req: Request, res: Response) => {
    const { tenantIds, recipientEmail } = req.body;

    if (!Array.isArray(tenantIds) || tenantIds.length === 0) {
      throw new AppError("Tenant IDs must be a non-empty array", 400);
    }

    if (!recipientEmail) {
      throw new AppError("Email is required", 400);
    }

    const isDenied = await validateEmailWithArcjet({
      req,
      email: recipientEmail,
    });
    if (isDenied) {
      throw new AppError("Invalid email address", 400);
    }

    const { messageId } = await enqueueTenantExportService({
      tenantIds,
      recipientEmail,
    });

    sendSuccess(
      res,
      202,
      "Your export is being prepared. You'll receive an email when it's ready.",
      {
        messageId,
        tenantCount: tenantIds.length,
        recipientEmail,
      },
    );
  },
);
