import { Call } from "../models/call.model.js";
import { Lead } from "../models/lead.model.js";
import { AppError } from "../utils/app-error.js";
import { createLeadActionHistoryService } from "./lead-action-history.service.js";

export const fetchCallsByLeadService = async ({
  leadId,
  cursor,
  limit,
  search,
}) => {
  const countQuery = { leadId };
  if (search) {
    countQuery.status = { $regex: search, $options: "i" };
  }

  const whereQuery = { ...countQuery };
  if (cursor) {
    whereQuery._id = { $gt: cursor };
  }

  const [totalCount, calls] = await Promise.all([
    Call.countDocuments(countQuery).exec(),
    Call.find(whereQuery).sort({ createdAt: -1 }).limit(limit).exec(),
  ]);

  return { calls, totalCount };
};

export const createCallForLeadService = async ({
  tenantId,
  leadId,
  userId,
  userName,
  type,
  from,
  status,
  duration,
}) => {
  const lead = await Lead.findById(leadId).exec();
  if (!lead) {
    throw new AppError("Lead not found", 404);
  }

  const call = await Call.create({
    tenantId,
    leadId,
    type,
    to: lead.firstName,
    from,
    status,
    duration: duration || 0,
  });

  await createLeadActionHistoryService({
    leadId,
    actionType: "lead_call_logged",
    message: `Call logged by ${userName} — type: ${type}, status: ${status}, duration: ${duration || 0}s`,
    userId,
    userName,
  });

  return call;
};
