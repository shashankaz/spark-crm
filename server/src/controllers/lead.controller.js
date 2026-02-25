import {
  fetchLeadsService,
  fetchLeadByIdService,
  createLeadService,
  updateLeadByIdService,
  deleteLeadByIdService,
  fetchOrganizationsService,
  bulkWriteLeadsService,
  convertLeadToDealService,
  fetchLeadActivityByLeadIdService,
} from "../services/lead.service.js";
import { AppError } from "../shared/app-error.js";
import { sendSuccess } from "../shared/api-response.js";

export const getAllLeads = async (req, res, next) => {
  try {
    const { tenantId } = req.user;
    if (!tenantId) {
      throw new AppError("Tenant ID is missing in user data", 400);
    }

    const cursor = req.query.cursor;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search;

    const { leads, totalCount } = await fetchLeadsService({
      tenantId,
      cursor,
      limit,
      search,
    });

    sendSuccess(res, 200, "Leads retrieved successfully", {
      leads,
      totalCount,
    });
  } catch (error) {
    next(error);
  }
};

export const getLeadById = async (req, res, next) => {
  try {
    const { tenantId } = req.user;
    if (!tenantId) {
      throw new AppError("Tenant ID is missing in user data", 400);
    }

    const { id } = req.params;
    if (!id) {
      throw new AppError("Lead ID is required", 400);
    }

    const lead = await fetchLeadByIdService({ id, tenantId });
    if (!lead) {
      throw new AppError("Lead not found", 404);
    }

    sendSuccess(res, 200, "Lead retrieved successfully", { lead });
  } catch (error) {
    next(error);
  }
};

export const createLead = async (req, res, next) => {
  try {
    const { tenantId } = req.user;
    if (!tenantId) {
      throw new AppError("Tenant ID is missing in user data", 400);
    }

    const {
      idempotentId,
      orgId,
      orgName,
      firstName,
      lastName,
      email,
      mobile,
      gender,
      source,
    } = req.body;
    if (!idempotentId || !tenantId || !orgId || !orgName) {
      throw new AppError(
        "Idempotent ID, Tenant ID, Organization ID, and Organization Name are required",
        400,
      );
    }

    const lead = await createLeadService({
      idempotentId,
      tenantId,
      orgId,
      orgName,
      userId: req.user._id,
      userName: req.user.firstName,
      firstName,
      lastName,
      email,
      mobile,
      gender,
      source,
    });
    if (!lead) {
      throw new AppError("Failed to create lead", 400);
    }

    sendSuccess(res, 201, "Lead created successfully", { lead });
  } catch (error) {
    next(error);
  }
};

export const updateLeadById = async (req, res, next) => {
  try {
    const { tenantId } = req.user;
    if (!tenantId) {
      throw new AppError("Tenant ID is missing in user data", 400);
    }

    const { id } = req.params;
    if (!id) {
      throw new AppError("Lead ID is required", 400);
    }

    const {
      orgId,
      orgName,
      firstName,
      lastName,
      email,
      mobile,
      gender,
      source,
      status,
    } = req.body;

    const updatedLead = await updateLeadByIdService({
      id,
      tenantId,
      orgId,
      orgName,
      userId: req.user._id,
      userName: req.user.firstName,
      firstName,
      lastName,
      email,
      mobile,
      gender,
      source,
      status,
    });
    if (!updatedLead) {
      throw new AppError("Lead not found or failed to update", 404);
    }

    sendSuccess(res, 200, "Lead updated successfully", { updatedLead });
  } catch (error) {
    next(error);
  }
};

export const deleteLeadById = async (req, res, next) => {
  try {
    const { tenantId } = req.user;
    if (!tenantId) {
      throw new AppError("Tenant ID is missing in user data", 400);
    }

    const { id } = req.params;
    if (!id) {
      throw new AppError("Lead ID is required", 400);
    }

    const deleted = await deleteLeadByIdService({
      id,
      tenantId,
      userId: req.user._id,
      userName: req.user.firstName,
    });
    if (!deleted) {
      throw new AppError("Lead not found", 404);
    }

    sendSuccess(res, 200, "Lead deleted successfully", { id });
  } catch (error) {
    next(error);
  }
};

export const bulkWriteLeads = async (req, res, next) => {
  try {
    const { tenantId } = req.user;
    if (!tenantId) {
      throw new AppError("Tenant ID is missing in user data", 400);
    }

    const { leads } = req.body;
    if (!Array.isArray(leads) || leads.length === 0) {
      throw new AppError("leads must be a non-empty array", 400);
    }

    const result = await bulkWriteLeadsService({ tenantId, leads });

    sendSuccess(
      res,
      201,
      `${result.insertedCount} lead(s) created successfully`,
      { insertedCount: result.insertedCount },
    );
  } catch (error) {
    next(error);
  }
};

export const convertLeadToDeal = async (req, res, next) => {
  try {
    const { tenantId } = req.user;
    if (!tenantId) {
      throw new AppError("Tenant ID is missing in user data", 400);
    }

    const { id } = req.params;
    if (!id) {
      throw new AppError("Lead ID is required", 400);
    }

    const { idempotentId, dealName, value, probability } = req.body;
    if (!idempotentId) {
      throw new AppError("Idempotent ID is required for deal creation", 400);
    }

    const { deal } = await convertLeadToDealService({
      id,
      tenantId,
      userId: req.user._id,
      userName: req.user.firstName,
      idempotentId,
      dealName,
      value,
      probability,
    });

    sendSuccess(res, 201, "Lead converted to deal successfully", { deal });
  } catch (error) {
    next(error);
  }
};

export const getAllOrganizations = async (req, res, next) => {
  try {
    const { tenantId } = req.user;
    if (!tenantId) {
      throw new AppError("Tenant ID is missing in user data", 400);
    }

    const limit = Number(req.query.limit) || 10;
    const search = req.query.search;

    const { organizations } = await fetchOrganizationsService({
      tenantId,
      limit,
      search,
    });

    sendSuccess(res, 200, "Organizations retrieved successfully", {
      organizations,
    });
  } catch (error) {
    next(error);
  }
};

export const getLeadActivityByLeadId = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new AppError("Lead ID is required", 400);
    }

    const activities = await fetchLeadActivityByLeadIdService({
      leadId: id,
    });

    sendSuccess(res, 200, "Lead activities retrieved successfully", {
      activities,
    });
  } catch (error) {
    next(error);
  }
};
