import { formatDate } from "date-fns";
import { Types } from "mongoose";
import { Organization } from "../models/organization.model";
import { AppError } from "../shared/app-error";
import {
  FetchOrganizationsInput,
  FetchOrganizationByIdInput,
  CreateOrganizationInput,
  UpdateOrganizationByIdInput,
  DeleteOrganizationByIdInput,
} from "../types/services/organization.service.types";
import {
  OrganizationIndustry,
  OrganizationSize,
} from "../types/models/organization.model.types";

export const fetchOrganizationsService = async ({
  tenantId,
  cursor,
  limit,
  search,
}: FetchOrganizationsInput) => {
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
    Organization.find(whereQuery).sort({ _id: -1 }).limit(limit).exec(),
  ]);

  const formattedOrganizations = organizations.map((org) => ({
    _id: org._id,
    name: org.name,
    industry: org.industry || undefined,
    country: org.country || undefined,
    size: org.size || undefined,
    website: org.website || undefined,
    updatedAt: formatDate(org.updatedAt, "dd/MM/yyyy"),
  }));

  return { organizations: formattedOrganizations, totalCount };
};

export const fetchOrganizationByIdService = async ({
  id,
  tenantId,
}: FetchOrganizationByIdInput) => {
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
}: CreateOrganizationInput) => {
  return await Organization.create({
    idempotentId,
    tenantId,
    userId,
    name,
    industry: industry,
    size: size,
    country: country,
    email: email || undefined,
    mobile: mobile || undefined,
    website: website || undefined,
    contactName: contactName || undefined,
    contactEmail: contactEmail || undefined,
    contactMobile: contactMobile || undefined,
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
}: UpdateOrganizationByIdInput) => {
  const organization = await Organization.findOne({ _id: id, tenantId }).exec();
  if (!organization) {
    throw new AppError("Organization not found", 404);
  }

  organization.userId = (userId as Types.ObjectId) || organization.userId;
  organization.name = name || organization.name;
  organization.industry =
    (industry as OrganizationIndustry) || organization.industry;
  organization.size = (size as OrganizationSize) || organization.size;
  organization.country = country || organization.country;
  organization.email = email || organization.email;
  organization.mobile = mobile || organization.mobile;
  organization.website = website || organization.website;
  organization.contactName = contactName || organization.contactName;
  organization.contactEmail = contactEmail || organization.contactEmail;
  organization.contactMobile = contactMobile || organization.contactMobile;

  return await organization.save();
};

export const deleteOrganizationByIdService = async ({
  id,
  tenantId,
}: DeleteOrganizationByIdInput) => {
  const organization = await Organization.findOne({ _id: id, tenantId }).exec();
  if (!organization) {
    throw new AppError("Organization not found", 404);
  }

  return await Organization.deleteOne({ _id: id, tenantId }).exec();
};
