import { Request, Response } from "express";
import { Types } from "mongoose";
import {
  fetchOrganizationsService,
  fetchOrganizationByIdService,
  createOrganizationService,
  updateOrganizationByIdService,
  deleteOrganizationByIdService,
} from "./services/organization.service";
import { enqueueOrganizationExportService } from "../../utils/export/export.helper";
import { AppError } from "../../shared/app-error";
import { sendSuccess } from "../../shared/api-response";
import { asyncHandler } from "../../shared/async-handler";
import { validateEmailWithArcjet } from "../../utils/arcjet/validate-email";

export const getAllOrganizations = asyncHandler(
  async (req: Request, res: Response) => {
    const { tenantId } = req.user;
    if (!tenantId) {
      throw new AppError("Tenant ID is missing in user data", 400);
    }

    const cursor = req.query.cursor as Types.ObjectId | undefined;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search as string | undefined;
    const industry = req.query.industry as string | undefined;
    const size = req.query.size as string | undefined;
    const country = req.query.country as string | undefined;

    const { organizations, totalCount } = await fetchOrganizationsService({
      tenantId,
      cursor,
      limit,
      search,
      industry,
      size,
      country,
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

    const id = req.params.id as unknown as Types.ObjectId;
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

    if (email) {
      const isDenied = await validateEmailWithArcjet({ req, email });
      if (isDenied) {
        throw new AppError("Invalid email address", 400);
      }
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

    const id = req.params.id as unknown as Types.ObjectId;
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

    if (email) {
      const isDenied = await validateEmailWithArcjet({ req, email });
      if (isDenied) {
        throw new AppError("Invalid email address", 400);
      }
    }

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

    const id = req.params.id as unknown as Types.ObjectId;
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

export const exportOrganizations = asyncHandler(
  async (req: Request, res: Response) => {
    const { tenantId } = req.user;
    if (!tenantId) {
      throw new AppError("Tenant ID is missing in user data", 400);
    }

    const { organizationIds, recipientEmail } = req.body;

    if (!Array.isArray(organizationIds) || organizationIds.length === 0) {
      throw new AppError("Organization IDs must be a non-empty array", 400);
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

    const { messageId } = await enqueueOrganizationExportService({
      tenantId,
      organizationIds,
      recipientEmail,
    });

    sendSuccess(
      res,
      202,
      "Your export is being prepared. You'll receive an email when it's ready.",
      {
        messageId,
        organizationCount: organizationIds.length,
        recipientEmail,
      },
    );
  },
);
