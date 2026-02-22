import { formatDate } from "date-fns";
import { Organization } from "../models/organization.model.js";
import { AppError } from "../utils/app-error.js";

export const fetchOrganizationsService = async ({
  tenantId,
  cursor,
  limit,
  search,
}) => {
  const countQuery = { tenantId };
  if (search) {
    countQuery.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { contactName: { $regex: search, $options: "i" } },
    ];
  }

  const whereQuery = { ...countQuery };
  if (cursor) {
    whereQuery._id = { $gt: cursor };
  }

  const [totalCount, organizations] = await Promise.all([
    Organization.countDocuments(countQuery).exec(),
    Organization.find(whereQuery).sort({ createdAt: -1 }).limit(limit).exec(),
  ]);

  const formattedOrganizations = organizations.map((org) => ({
    _id: org._id,
    name: org.name,
    industry: org.industry || "",
    country: org.country || "",
    size: org.size || "",
    website: org.website || "",
    updatedAt: formatDate(org.updatedAt, "dd/MM/yyyy"),
  }));

  return { organizations: formattedOrganizations, totalCount };
};

export const fetchOrganizationByIdService = async ({ id, tenantId }) => {
  return await Organization.findOne({ _id: id, tenantId }).exec();
};

export const createOrganizationService = async ({
  idempotentId,
  tenantId,
  userId,
  name,
  industry,
  size,
  country,
  email,
  mobile,
  website,
  contactName,
  contactEmail,
  contactMobile,
}) => {
  return await Organization.create({
    idempotentId,
    tenantId,
    userId,
    name,
    industry: industry || "",
    size: size || "",
    country: country || "",
    email: email || "",
    mobile: mobile || "",
    website: website || "",
    contactName: contactName || "",
    contactEmail: contactEmail || "",
    contactMobile: contactMobile || "",
  });
};

export const updateOrganizationByIdService = async ({
  id,
  tenantId,
  userId,
  name,
  industry,
  size,
  country,
  email,
  mobile,
  website,
  contactName,
  contactEmail,
  contactMobile,
}) => {
  const organization = await Organization.findOne({ _id: id, tenantId }).exec();
  if (!organization) {
    throw new AppError("Organization not found", 404);
  }

  organization.userId = userId || organization.userId;
  organization.name = name || organization.name;
  organization.industry = industry || organization.industry;
  organization.size = size || organization.size;
  organization.country = country || organization.country;
  organization.email = email || organization.email;
  organization.mobile = mobile || organization.mobile;
  organization.website = website || organization.website;
  organization.contactName = contactName || organization.contactName;
  organization.contactEmail = contactEmail || organization.contactEmail;
  organization.contactMobile = contactMobile || organization.contactMobile;

  return await organization.save();
};

export const deleteOrganizationByIdService = async ({ id, tenantId }) => {
  const organization = await Organization.findOne({ _id: id, tenantId }).exec();
  if (!organization) {
    throw new AppError("Organization not found", 404);
  }

  return await Organization.deleteOne({ _id: id, tenantId }).exec();
};
