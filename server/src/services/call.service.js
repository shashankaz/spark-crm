import { Call } from "../models/call.model.js";
import { Lead } from "../models/lead.model.js";
import { AppError } from "../utils/app-error.js";

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
    Call.find(whereQuery).sort({ _id: 1 }).limit(limit).exec(),
  ]);

  return { calls, totalCount };
};

export const createCallForLeadService = async ({
  tenantId,
  leadId,
  type,
  from,
  status,
  duration,
}) => {
  const lead = await Lead.findById(leadId).exec();
  if (!lead) {
    throw new AppError("Lead not found", 404);
  }

  return await Call.create({
    tenantId,
    leadId,
    type,
    to: lead.firstName,
    from,
    status,
    duration,
  });
};
