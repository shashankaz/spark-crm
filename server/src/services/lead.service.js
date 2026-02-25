import { formatDate } from "date-fns";
import mongoose from "mongoose";
import { Lead } from "../models/lead.model.js";
import { Deal } from "../models/deal.model.js";
import { Organization } from "../models/organization.model.js";
import { AppError } from "../shared/app-error.js";
import { calculateLeadScore } from "../utils/calculate-score.js";
import { createLeadActionHistoryService } from "./lead-action-history.service.js";
import { LeadActionHistory } from "../models/lead-action-history.model.js";

export const fetchLeadsService = async ({
  tenantId,
  cursor,
  limit,
  search,
}) => {
  const countQuery = { tenantId };
  if (search) {
    countQuery.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const whereQuery = { ...countQuery };
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
    lastName: lead.lastName || "",
    email: lead.email,
    orgName: lead.orgName,
    score: lead.score || 0,
    updatedAt: formatDate(lead.updatedAt, "dd/MM/yyyy"),
  }));

  return { leads: formattedLeads, totalCount };
};

export const fetchLeadByIdService = async ({ id, tenantId }) => {
  return await Lead.findOne({ _id: id, tenantId }).exec();
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
}) => {
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
}) => {
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

  lead.orgId = orgId || lead.orgId;
  lead.orgName = orgName || lead.orgName;
  lead.userId = userId || lead.userId;
  lead.firstName = firstName || lead.firstName;
  lead.lastName = lastName || lead.lastName;
  lead.email = email || lead.email;
  lead.mobile = mobile || lead.mobile;
  lead.gender = gender || lead.gender;
  lead.source = source || lead.source;
  lead.status = status || lead.status;

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
}) => {
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

export const bulkWriteLeadsService = async ({ tenantId, leads }) => {
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
}) => {
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
}) => {
  const whereQuery = { tenantId };
  if (search) {
    whereQuery.name = { $regex: search, $options: "i" };
  }

  const organizations = await Organization.find(whereQuery)
    .select("_id name")
    .limit(limit)
    .exec();

  return { organizations };
};

export const fetchLeadActivityByLeadIdService = async ({ leadId }) => {
  return await LeadActionHistory.find({ leadId }).sort({ _id: -1 }).exec();
};
