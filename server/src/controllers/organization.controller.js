import {
  fetchOrganizationsService,
  fetchOrganizationByIdService,
  createOrganizationService,
  updateOrganizationByIdService,
  deleteOrganizationByIdService,
} from "../services/organization.service.js";

export const getAllOrganizations = async (req, res, next) => {
  try {
    const { tenantId } = req.user;
    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: "Tenant ID is missing in user data",
      });
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

    res.json({
      success: true,
      message: "Organizations retrieved successfully",
      data: { organizations, totalCount },
    });
  } catch (error) {
    next(error);
  }
};

export const getOrganizationById = async (req, res, next) => {
  try {
    const { tenantId } = req.user;
    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: "Tenant ID is missing in user data",
      });
    }

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Organization ID is required",
      });
    }

    const organization = await fetchOrganizationByIdService({ id, tenantId });
    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    res.json({
      success: true,
      message: "Organization retrieved successfully",
      data: { organization },
    });
  } catch (error) {
    next(error);
  }
};

export const createOrganization = async (req, res, next) => {
  try {
    const { tenantId } = req.user;
    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: "Tenant ID is missing in user data",
      });
    }

    const {
      idempotentId,
      userId,
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

    if (!idempotentId || !userId || !name) {
      return res.status(400).json({
        success: false,
        message: "Idempotent ID, User ID, and Organization Name are required",
      });
    }

    const organization = await createOrganizationService({
      idempotentId,
      tenantId,
      userId,
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
      return res.status(400).json({
        success: false,
        message: "Failed to create organization",
      });
    }

    res.status(201).json({
      success: true,
      message: "Organization created successfully",
      data: { organization },
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrganizationById = async (req, res, next) => {
  try {
    const { tenantId } = req.user;
    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: "Tenant ID is missing in user data",
      });
    }

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Organization ID is required",
      });
    }

    const {
      userId,
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
      userId,
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
      return res.status(404).json({
        success: false,
        message: "Organization not found or failed to update",
      });
    }

    res.json({
      success: true,
      message: "Organization updated successfully",
      data: { updatedOrganization },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteOrganizationById = async (req, res, next) => {
  try {
    const { tenantId } = req.user;
    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: "Tenant ID is missing in user data",
      });
    }

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Organization ID is required",
      });
    }

    const deleted = await deleteOrganizationByIdService({ id, tenantId });
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Organization not found",
      });
    }

    res.json({
      success: true,
      message: "Organization deleted successfully",
      data: { id },
    });
  } catch (error) {
    next(error);
  }
};
