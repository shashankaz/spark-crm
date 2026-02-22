import {
  fetchLeadsService,
  fetchLeadByIdService,
  createLeadService,
  updateLeadByIdService,
  deleteLeadByIdService,
  fetchOrganizationsService,
  bulkWriteLeadsService,
  convertLeadToDealService,
} from "../services/lead.service.js";

export const getAllLeads = async (req, res, next) => {
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

    const { leads, totalCount } = await fetchLeadsService({
      tenantId,
      cursor,
      limit,
      search,
    });

    res.json({
      success: true,
      message: "Leads retrieved successfully",
      data: { leads, totalCount },
    });
  } catch (error) {
    next(error);
  }
};

export const getLeadById = async (req, res, next) => {
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
        message: "Lead ID is required",
      });
    }

    const lead = await fetchLeadByIdService({ id, tenantId });
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    res.json({
      success: true,
      message: "Lead retrieved successfully",
      data: { lead },
    });
  } catch (error) {
    next(error);
  }
};

export const createLead = async (req, res, next) => {
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
      orgId,
      orgName,
      userId,
      firstName,
      lastName,
      email,
      mobile,
      gender,
      source,
    } = req.body;
    if (!idempotentId || !tenantId || !orgId || !orgName || !userId) {
      return res.status(400).json({
        success: false,
        message:
          "Idempotent ID, Tenant ID, Organization ID, Organization Name, and User ID are required",
      });
    }

    const lead = await createLeadService({
      idempotentId,
      tenantId,
      orgId,
      orgName,
      userId,
      firstName,
      lastName,
      email,
      mobile,
      gender,
      source,
    });
    if (!lead) {
      return res.status(400).json({
        success: false,
        message: "Failed to create lead",
      });
    }

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: { lead },
    });
  } catch (error) {
    next(error);
  }
};

export const updateLeadById = async (req, res, next) => {
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
        message: "Lead ID is required",
      });
    }

    const {
      orgId,
      orgName,
      dealId,
      userId,
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
      dealId,
      userId,
      firstName,
      lastName,
      email,
      mobile,
      gender,
      source,
      status,
    });
    if (!updatedLead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found or failed to update",
      });
    }

    res.json({
      success: true,
      message: "Lead updated successfully",
      data: { updatedLead },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLeadById = async (req, res, next) => {
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
        message: "Lead ID is required",
      });
    }

    const deleted = await deleteLeadByIdService({ id, tenantId });
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    res.json({
      success: true,
      message: "Lead deleted successfully",
      data: { id },
    });
  } catch (error) {
    next(error);
  }
};

export const bulkWriteLeads = async (req, res, next) => {
  try {
    const { tenantId } = req.user;
    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: "Tenant ID is missing in user data",
      });
    }

    const { leads } = req.body;
    if (!Array.isArray(leads) || leads.length === 0) {
      return res.status(400).json({
        success: false,
        message: "leads must be a non-empty array",
      });
    }

    const result = await bulkWriteLeadsService({ tenantId, leads });

    res.status(201).json({
      success: true,
      message: `${result.insertedCount} lead(s) created successfully`,
      data: { insertedCount: result.insertedCount },
    });
  } catch (error) {
    next(error);
  }
};

export const convertLeadToDeal = async (req, res, next) => {
  try {
    const { tenantId, _id: userId } = req.user;
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
        message: "Lead ID is required",
      });
    }

    const { idempotentId, dealName, value, probability } = req.body;
    if (!idempotentId) {
      return res.status(400).json({
        success: false,
        message: "Idempotent ID is required for deal creation",
      });
    }

    const { deal } = await convertLeadToDealService({
      id,
      tenantId,
      userId,
      idempotentId,
      dealName,
      value,
      probability,
    });

    res.status(201).json({
      success: true,
      message: "Lead converted to deal successfully",
      data: { deal },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllOrganizations = async (req, res, next) => {
  try {
    const { tenantId } = req.user;
    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: "Tenant ID is missing in user data",
      });
    }

    const limit = Number(req.query.limit) || 10;
    const search = req.query.search;

    const { organizations } = await fetchOrganizationsService({
      tenantId,
      limit,
      search,
    });

    res.json({
      success: true,
      message: "Organizations retrieved successfully",
      data: { organizations },
    });
  } catch (error) {
    next(error);
  }
};
