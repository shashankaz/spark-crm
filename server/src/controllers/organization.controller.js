import {
  fetchOrganizationsService,
  fetchOrganizationByIdService,
  createOrganizationService,
  updateOrganizationByIdService,
  deleteOrganizationByIdService,
} from "../services/organization.service.js";
import { AppError } from "../shared/app-error.js";
import { sendSuccess } from "../shared/api-response.js";

export const getAllOrganizations = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

export const getOrganizationById = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

export const createOrganization = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

export const updateOrganizationById = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

export const deleteOrganizationById = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};
