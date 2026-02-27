import { formatDate } from "date-fns";
import mongoose, { Types } from "mongoose";
import { Lead } from "../models/lead.model";
import { Deal } from "../models/deal.model";
import { Organization } from "../models/organization.model";
import { User } from "../models/user.model";
import { AppError } from "../shared/app-error";
import { calculateLeadScore } from "../utils/calculate-score";
import { createLeadActionHistoryService } from "./lead-action-history.service";
import { LeadActionHistory } from "../models/lead-action-history.model";
import {
  FetchLeadsInput,
  FetchLeadByIdInput,
  CreateLeadInput,
  UpdateLeadByIdInput,
  DeleteLeadByIdInput,
  BulkWriteLeadsInput,
  ConvertLeadToDealInput,
  FetchOrganizationsForLeadInput,
  FetchLeadActivityByLeadIdInput,
  AssignLeadInput,
} from "../types/services/lead.service.types";
import { LeadGender, LeadStatus } from "../types/models/lead.model.types";

export const fetchLeadsService = async ({
  tenantId,
  cursor,
  limit,
  search,
  orgId,
  userId,
  role,
}: FetchLeadsInput) => {
  const countQuery: any = { tenantId };

  if (role !== "admin") countQuery.userId = userId;

  if (orgId) {
    countQuery.orgId = orgId;
  }

  if (search) {
    countQuery.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const whereQuery: any = { ...countQuery };
  if (cursor) {
    whereQuery._id = { $gt: cursor };
  }

  const [totalCount, leads] = await Promise.all([
    Lead.countDocuments(countQuery).exec(),
    Lead.find(whereQuery).sort({ _id: -1 }).limit(limit).exec(),
  ]);

  const formattedLeads = leads.map((lead) => ({
    _id: lead._id,
    firstName: lead.firstName,
    lastName: lead.lastName ?? "-",
    email: lead.email,
    orgName: lead.orgName,
    score: lead.score ?? 0,
    updatedAt: formatDate(lead.updatedAt, "dd/MM/yyyy"),
  }));

  return { leads: formattedLeads, totalCount };
};

export const fetchLeadByIdService = async ({
  id,
  tenantId,
  userId,
  role,
}: FetchLeadByIdInput) => {
  const lead = await Lead.findOne({ _id: id, tenantId }).exec();
  if (!lead) {
    throw new AppError("Lead not found", 404);
  }

  if (role !== "admin" && lead.userId !== userId) {
    throw new AppError("Unauthorized", 403);
  }

  return lead;
};

export const createLeadService = async ({
  idempotentId,
  tenantId,
  orgId,
  orgName,
  userId,
  userName,
  firstName,
  lastName,
  email,
  mobile,
  gender,
  source,
}: CreateLeadInput) => {
  const lead = new Lead({
    idempotentId,
    tenantId,
    orgId,
    orgName,
    dealId: undefined,
    userId,
    firstName: firstName || undefined,
    lastName: lastName || undefined,
    email: email || undefined,
    mobile: mobile || undefined,
    gender: gender || undefined,
    source: source || undefined,
  });

  lead.score = calculateLeadScore(lead);

  await createLeadActionHistoryService({
    leadId: lead._id,
    actionType: "lead_created",
    message: `Lead created by ${userName}`,
    userId,
    userName,
  });

  return await lead.save();
};

export const updateLeadByIdService = async ({
  id,
  tenantId,
  orgId,
  orgName,
  userId,
  userName,
  firstName,
  lastName,
  email,
  mobile,
  gender,
  source,
  status,
}: UpdateLeadByIdInput) => {
  const lead = await Lead.findOne({ _id: id, tenantId }).exec();
  if (!lead) {
    throw new AppError("Lead not found", 404);
  }

  if (lead.dealId || lead.status === "converted") {
    throw new AppError(
      "Cannot update a lead that has been converted to a deal",
      400,
    );
  }

  lead.orgId = (orgId as Types.ObjectId) || lead.orgId;
  lead.orgName = orgName || lead.orgName;
  lead.userId = (userId as Types.ObjectId) || lead.userId;
  lead.firstName = firstName || lead.firstName;
  lead.lastName = lastName || lead.lastName;
  lead.email = email || lead.email;
  lead.mobile = mobile || lead.mobile;
  lead.gender = (gender as LeadGender) || lead.gender;
  lead.source = source || lead.source;
  lead.status = (status as LeadStatus) || lead.status;

  lead.score = calculateLeadScore(lead);

  await createLeadActionHistoryService({
    leadId: lead._id,
    actionType: "lead_updated",
    message: `Lead updated by ${userName}`,
    userId,
    userName,
  });

  return await lead.save();
};

export const deleteLeadByIdService = async ({
  id,
  tenantId,
  userId,
  userName,
}: DeleteLeadByIdInput) => {
  const lead = await Lead.findOne({ _id: id, tenantId }).exec();
  if (!lead) {
    throw new AppError("Lead not found", 404);
  }

  if (lead.dealId || lead.status === "converted") {
    throw new AppError(
      "Cannot delete a lead that has been converted to a deal",
      400,
    );
  }

  await createLeadActionHistoryService({
    leadId: lead._id,
    actionType: "lead_deleted",
    message: `Lead deleted by ${userName}`,
    userId,
    userName,
  });

  return await Lead.deleteOne({ _id: id, tenantId }).exec();
};

export const bulkWriteLeadsService = async ({
  tenantId,
  leads,
}: BulkWriteLeadsInput) => {
  const operations = leads.map((lead) => {
    const document = {
      idempotentId: lead.idempotentId,
      tenantId,
      orgId: lead.orgId || undefined,
      orgName: lead.orgName || undefined,
      dealId: undefined,
      userId: lead.userId || undefined,
      firstName: lead.firstName || undefined,
      lastName: lead.lastName || undefined,
      email: lead.email || undefined,
      mobile: lead.mobile || undefined,
      gender: lead.gender || undefined,
      source: lead.source || undefined,
    };

    document.score = calculateLeadScore(document);

    return { insertOne: { document } };
  });

  return await Lead.bulkWrite(operations, { ordered: false });
};

export const convertLeadToDealService = async ({
  id,
  tenantId,
  userId,
  userName,
  idempotentId,
  dealName,
  value,
  probability,
}: ConvertLeadToDealInput) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const lead = await Lead.findOne({ _id: id, tenantId })
      .session(session)
      .exec();
    if (!lead) {
      throw new AppError("Lead not found", 404);
    }

    if (lead.status === "converted") {
      throw new AppError("Lead has already been converted to a deal", 400);
    }

    const deal = new Deal({
      idempotentId,
      tenantId,
      leadId: lead._id,
      userId: userId,
      name: dealName || "Untitled Deal",
      value: value ?? 0,
      probability: probability ?? 0,
    });

    await deal.save({ session });

    lead.status = "converted";
    lead.dealId = deal._id;
    lead.score = calculateLeadScore(lead);

    await lead.save({ session });

    await createLeadActionHistoryService({
      leadId: lead._id,
      actionType: "lead_converted",
      message: `Lead converted to deal "${deal.name}" by ${userName}`,
      userId,
      userName,
    });

    await session.commitTransaction();

    return { deal };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const fetchOrganizationsService = async ({
  tenantId,
  limit,
  search,
  userId,
  role,
}: FetchOrganizationsForLeadInput) => {
  const whereQuery: any = { tenantId };
  if (role !== "admin") whereQuery.userId = userId;
  if (search) {
    whereQuery.name = { $regex: search, $options: "i" };
  }

  const organizations = await Organization.find(whereQuery)
    .select("_id name")
    .limit(limit)
    .exec();

  return { organizations };
};

export const fetchLeadActivityByLeadIdService = async ({
  leadId,
}: FetchLeadActivityByLeadIdInput) => {
  return await LeadActionHistory.find({ leadId }).sort({ _id: -1 }).exec();
};

export const assignLeadService = async ({
  leadId,
  tenantId,
  assignedUserId,
  adminUserId,
  adminUserName,
}: AssignLeadInput) => {
  const lead = await Lead.findOne({ _id: leadId, tenantId }).exec();
  if (!lead) {
    throw new AppError("Lead not found", 404);
  }

  if (lead.status === "converted") {
    throw new AppError(
      "Cannot reassign a lead that has been converted to a deal",
      400,
    );
  }

  const assignedUser = await User.findOne({
    _id: assignedUserId,
    tenantId,
  }).exec();
  if (!assignedUser) {
    throw new AppError("Assigned user not found in this tenant", 404);
  }

  const previousUserId = lead.userId;
  lead.userId = assignedUser._id as Types.ObjectId;
  lead.score = calculateLeadScore(lead);

  await createLeadActionHistoryService({
    leadId: lead._id,
    actionType: "lead_updated",
    message: `Lead reassigned from user ${previousUserId} to ${assignedUser.firstName} by ${adminUserName}`,
    userId: adminUserId,
    userName: adminUserName,
  });

  return await lead.save();
};
