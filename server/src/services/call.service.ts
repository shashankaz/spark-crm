import { Types } from "mongoose";
import { Call } from "../models/call.model";
import { Lead } from "../models/lead.model";
import { AppError } from "../shared/app-error";
import { createLeadActionHistoryService } from "./lead-action-history.service";
import {
  FetchCallsByLeadInput,
  FetchCallsByLeadResponse,
  CreateCallForLeadInput,
  CallResponse,
} from "../types/services/call.service.types";

export const fetchCallsByLeadService = async ({
  leadId,
  cursor,
  limit,
  search,
}: FetchCallsByLeadInput): Promise<FetchCallsByLeadResponse> => {
  const countQuery: any = {
    leadId: new Types.ObjectId(leadId),
  };

  if (search) {
    countQuery.status = { $regex: search, $options: "i" };
  }

  const whereQuery = { ...countQuery };

  if (cursor) {
    whereQuery._id = { $lt: new Types.ObjectId(cursor) };
  }

  const [totalCount, calls] = await Promise.all([
    Call.countDocuments(countQuery).exec(),
    Call.find(whereQuery).sort({ _id: -1 }).limit(limit).exec(),
  ]);

  const formattedCalls: CallResponse[] = calls.map((call) => ({
    _id: call._id,
    leadId: call.leadId,
    type: call.type,
    to: call.to,
    from: call.from,
    status: call.status,
    duration: call.duration,
    createdAt: call.createdAt,
  }));

  return {
    calls: formattedCalls,
    totalCount,
  };
};

export const createCallForLeadService = async ({
  leadId,
  userId,
  userName,
  type,
  from,
  status,
  duration,
}: CreateCallForLeadInput): Promise<CallResponse> => {
  const lead = await Lead.findById(leadId).exec();

  if (!lead) {
    throw new AppError("Lead not found", 404);
  }

  const call = await Call.create({
    leadId: new Types.ObjectId(leadId),
    type,
    to: lead.firstName,
    from,
    status,
    duration: duration ?? 0,
  });

  await createLeadActionHistoryService({
    leadId,
    actionType: "lead_call_logged",
    message: `Call logged by ${userName} — type: ${type}, status: ${status}, duration: ${
      duration ?? 0
    }s`,
    userId,
    userName,
  });

  return {
    _id: call._id,
    leadId: call.leadId,
    type: call.type,
    to: call.to,
    from: call.from,
    status: call.status,
    duration: call.duration,
    createdAt: call.createdAt,
  };
};
