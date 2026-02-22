import { formatDate } from "date-fns";
import { Lead } from "../models/lead.model.js";
import { AppError } from "../utils/app-error.js";
import { calculateLeadScore } from "../utils/calculate-score.js";

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
    dealId: null,
    userId,
    firstName: firstName || "",
    lastName: lastName || "",
    email: email || "",
    mobile: mobile || "",
    gender: gender || "",
    source: source || "",
  });

  lead.score = calculateLeadScore(lead);

  return await lead.save();
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

  lead.score = calculateLeadScore(lead);

  return await lead.save();
};

export const deleteLeadByIdService = async ({ id, tenantId }) => {
  const lead = await Lead.findOne({ _id: id, tenantId }).exec();
  if (!lead) {
    throw new AppError("Lead not found", 404);
  }

  return await Lead.deleteOne({ _id: id, tenantId }).exec();
};

export const bulkWriteLeadsService = async ({ tenantId, leads }) => {
  const operations = leads.map((lead) => {
    const document = {
      idempotentId: lead.idempotentId,
      tenantId,
      orgId: lead.orgId || null,
      orgName: lead.orgName || "",
      dealId: null,
      userId: lead.userId || null,
      firstName: lead.firstName || "",
      lastName: lead.lastName || "",
      email: lead.email || "",
      mobile: lead.mobile || "",
      gender: lead.gender || "",
      source: lead.source || "",
    };

    document.score = calculateLeadScore(document);

    return { insertOne: { document } };
  });

  return await Lead.bulkWrite(operations, { ordered: false });
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

  return organizations.filter((org) => org.name);
};
