import { Request, Response } from "express";
import {
  fetchOrganizationsService,
  fetchOrganizationByIdService,
  createOrganizationService,
  updateOrganizationByIdService,
  deleteOrganizationByIdService,
} from "../services/organization.service";
import { AppError } from "../shared/app-error";
import { sendSuccess } from "../shared/api-response";
import { asyncHandler } from "../shared/async-handler";

export const getAllOrganizations = asyncHandler(
  async (req: Request, res: Response) => {
    const { tenantId } = req.user;
    if (!tenantId) {
      throw new AppError("Tenant ID is missing in user data", 400);
    }

    const cursor = req.query.cursor;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search;

    const { organizations, totalCount } = await fetchOrganizationsService({
      tenantId,
      cursor,
      limit,
      search,
    });

    sendSuccess(res, 200, "Organizations retrieved successfully", {
      organizations,
      totalCount,
    });
  },
);

export const getOrganizationById = asyncHandler(
  async (req: Request, res: Response) => {
    const { tenantId } = req.user;
    if (!tenantId) {
      throw new AppError("Tenant ID is missing in user data", 400);
    }

    const { id } = req.params;
    if (!id) {
      throw new AppError("Organization ID is required", 400);
    }

    const organization = await fetchOrganizationByIdService({ id, tenantId });
    if (!organization) {
      throw new AppError("Organization not found", 404);
    }

    sendSuccess(res, 200, "Organization retrieved successfully", {
      organization,
    });
  },
);

export const createOrganization = asyncHandler(
  async (req: Request, res: Response) => {
    const { tenantId } = req.user;
    if (!tenantId) {
      throw new AppError("Tenant ID is missing in user data", 400);
    }

    const {
      idempotentId,
      name,
      industry,
      size,
      country,
      email,
      mobile,
      website,
      contactName,
      contactEmail,
      contactMobile,
    } = req.body;

    if (!idempotentId || !name || !industry || !size || !country) {
      throw new AppError(
        "Idempotent ID, Organization Name, Industry, Size, and Country are required",
        400,
      );
    }

    const organization = await createOrganizationService({
      idempotentId,
      tenantId,
      userId: req.user._id,
      name,
      industry,
      size,
      country,
      email,
      mobile,
      website,
      contactName,
      contactEmail,
      contactMobile,
    });
    if (!organization) {
      throw new AppError("Failed to create organization", 400);
    }

    sendSuccess(res, 201, "Organization created successfully", {
      organization,
    });
  },
);

export const updateOrganizationById = asyncHandler(
  async (req: Request, res: Response) => {
    const { tenantId } = req.user;
    if (!tenantId) {
      throw new AppError("Tenant ID is missing in user data", 400);
    }

    const { id } = req.params;
    if (!id) {
      throw new AppError("Organization ID is required", 400);
    }

    const {
      name,
      industry,
      size,
      country,
      email,
      mobile,
      website,
      contactName,
      contactEmail,
      contactMobile,
    } = req.body;

    const updatedOrganization = await updateOrganizationByIdService({
      id,
      tenantId,
      userId: req.user._id,
      name,
      industry,
      size,
      country,
      email,
      mobile,
      website,
      contactName,
      contactEmail,
      contactMobile,
    });
    if (!updatedOrganization) {
      throw new AppError("Organization not found or failed to update", 404);
    }

    sendSuccess(res, 200, "Organization updated successfully", {
      updatedOrganization,
    });
  },
);

export const deleteOrganizationById = asyncHandler(
  async (req: Request, res: Response) => {
    const { tenantId } = req.user;
    if (!tenantId) {
      throw new AppError("Tenant ID is missing in user data", 400);
    }

    const { id } = req.params;
    if (!id) {
      throw new AppError("Organization ID is required", 400);
    }

    const deleted = await deleteOrganizationByIdService({ id, tenantId });
    if (!deleted) {
      throw new AppError("Organization not found", 404);
    }

    sendSuccess(res, 200, "Organization deleted successfully", { id });
  },
);
