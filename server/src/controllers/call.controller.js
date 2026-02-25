import {
  fetchCallsByLeadService,
  createCallForLeadService,
} from "../services/call.service.js";
import { AppError } from "../shared/app-error.js";
import { sendSuccess } from "../shared/api-response.js";
import { asyncHandler } from "../shared/async-handler.js";

export const getAllCallsByLeadId = asyncHandler(async (req, res, next) => {
  const { leadId } = req.params;
  if (!leadId) {
    throw new AppError("Lead ID is required", 400);
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

  sendSuccess(res, 200, "Calls retrieved successfully", {
    calls,
    totalCount,
  });
});

export const createCallForLead = asyncHandler(async (req, res, next) => {
  const { leadId } = req.params;
  if (!leadId) {
    throw new AppError("Lead ID is required", 400);
  }

  const { tenantId, _id: userId, firstName: userName } = req.user;
  if (!tenantId) {
    throw new AppError("Tenant ID is missing in user data", 400);
  }

  const { type, status, duration } = req.body;
  if (!type || !status) {
    throw new AppError("Type and status are required to create a call", 400);
  }

  const call = await createCallForLeadService({
    tenantId,
    leadId,
    userId,
    userName,
    type,
    from: userName,
    status,
    duration,
  });
  if (!call) {
    throw new AppError("Failed to create call", 400);
  }

  sendSuccess(res, 201, "Call created successfully", { call });
});
