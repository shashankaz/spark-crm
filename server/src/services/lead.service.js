import { formatDate } from "date-fns";
import { Lead } from "../models/lead.model.js";
import { AppError } from "../utils/app-error.js";

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
    Lead.find(whereQuery).sort({ createdAt: -1 }).limit(limit).exec(),
  ]);

  const formattedLeads = leads.map((lead) => ({
    _id: lead._id,
    firstName: lead.firstName,
    lastName: lead.lastName || "",
    email: lead.email,
    organization: lead.orgName,
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
  firstName,
  lastName,
  email,
  mobile,
  gender,
  source,
}) => {
  return await Lead.create({
    idempotentId,
    tenantId,
    orgId,
    orgName,
    dealId: null,
    userId,
    firstName: firstName || "",
    lastName: lastName || "",
    email: email || "",
    mobile: mobile || "",
    gender: gender || "",
    source: source || "",
  });
};

export const updateLeadByIdService = async ({
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
}) => {
  const lead = await Lead.findOne({ _id: id, tenantId }).exec();
  if (!lead) {
    throw new AppError("Lead not found", 404);
  }

  lead.orgId = orgId || lead.orgId;
  lead.orgName = orgName || lead.orgName;
  lead.dealId = dealId || lead.dealId;
  lead.userId = userId || lead.userId;
  lead.firstName = firstName || lead.firstName;
  lead.lastName = lastName || lead.lastName;
  lead.email = email || lead.email;
  lead.mobile = mobile || lead.mobile;
  lead.gender = gender || lead.gender;
  lead.source = source || lead.source;
  lead.status = status || lead.status;

  return await lead.save();
};

export const deleteLeadByIdService = async ({ id, tenantId }) => {
  const lead = await Lead.findOne({ _id: id, tenantId }).exec();
  if (!lead) {
    throw new AppError("Lead not found", 404);
  }

  return await Lead.deleteOne({ _id: id, tenantId }).exec();
};
