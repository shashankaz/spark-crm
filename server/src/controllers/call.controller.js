import {
  fetchCallsByLeadService,
  createCallForLeadService,
} from "../services/call.service.js";

export const getAllCallsByLeadId = async (req, res, next) => {
  try {
    const { leadId } = req.params;
    if (!leadId) {
      return res.status(400).json({
        success: false,
        message: "Lead ID is required",
      });
    }

    const cursor = req.query.cursor;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search;

    const { calls, totalCount } = await fetchCallsByLeadService({
      leadId,
      cursor,
      limit,
      search,
    });

    res.json({
      success: true,
      message: "Calls retrieved successfully",
      data: { calls, totalCount },
    });
  } catch (error) {
    next(error);
  }
};

export const createCallForLead = async (req, res, next) => {
  try {
    const { leadId } = req.params;
    if (!leadId) {
      return res.status(400).json({
        success: false,
        message: "Lead ID is required",
      });
    }

    const { tenantId, firstName } = req.user;
    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: "Tenant ID is missing in user data",
      });
    }

    const { type, status, duration } = req.body;
    if (!type || !status || !duration) {
      return res.status(400).json({
        success: false,
        message: "Type, status, and duration are required to create a call",
      });
    }

    const call = await createCallForLeadService({
      tenantId,
      leadId,
      type,
      from: firstName,
      status,
      duration,
    });
    if (!call) {
      return res.status(400).json({
        success: false,
        message: "Failed to create call",
      });
    }

    res.status(201).json({
      success: true,
      message: "Call created successfully",
      data: { call },
    });
  } catch (error) {
    next(error);
  }
};
