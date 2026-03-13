import { formatDate } from "date-fns";
import { Types } from "mongoose";
import { Organization } from "../models/organization.model";
import { AppError } from "../../../shared/app-error";
import {
  IFetchOrganizationsInput,
  IFetchOrganizationByIdInput,
  ICreateOrganizationInput,
  IUpdateOrganizationByIdInput,
  IDeleteOrganizationByIdInput,
} from "./organization.service.types";
import {
  IOrganizationDocument,
  OrganizationIndustry,
  OrganizationSize,
} from "../models/organization.model.types";

const ORG_SORT_FIELDS: Record<string, string> = {
  name: "name",
  industry: "industry",
  country: "country",
  size: "size",
  website: "website",
  updatedAt: "updatedAt",
  _id: "_id",
};

export const fetchOrganizationsService = async ({
  tenantId,
  cursor,
  limit,
  search,
  industry,
  size,
  country,
  sortBy = "_id",
  sortOrder = "desc",
}: IFetchOrganizationsInput) => {
  const resolvedSortField = ORG_SORT_FIELDS[sortBy] ?? "_id";
  const resolvedSortDir = sortOrder === "asc" ? 1 : -1;
  const sortStage: Record<string, 1 | -1> = {
    [resolvedSortField]: resolvedSortDir,
  };

  const whereQuery: any = { tenantId };

  if (search) {
    whereQuery.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { contactName: { $regex: search, $options: "i" } },
    ];
  }

  if (industry) {
    whereQuery.industry = industry;
  }

  if (size) {
    whereQuery.size = size;
  }

  if (country) {
    whereQuery.country = { $regex: country, $options: "i" };
  }

  if (cursor) {
    whereQuery._id = { $gt: cursor };
  }

  const [totalCount, organizations] = await Promise.all([
    Organization.countDocuments(whereQuery).exec(),
    Organization.find(whereQuery).sort(sortStage).limit(limit).exec(),
  ]);

  const formattedOrganizations = organizations.map(
    (org: IOrganizationDocument) => ({
      _id: org._id,
      name: org.name,
      industry: org.industry || undefined,
      country: org.country || undefined,
      size: org.size || undefined,
      website: org.website || undefined,
      updatedAt: formatDate(org.updatedAt, "dd/MM/yyyy"),
    }),
  );

  return { organizations: formattedOrganizations, totalCount };
};

export const fetchOrganizationByIdService = async ({
  id,
  tenantId,
}: IFetchOrganizationByIdInput) => {
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
}: ICreateOrganizationInput) => {
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
}: IUpdateOrganizationByIdInput) => {
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
}: IDeleteOrganizationByIdInput) => {
  const organization = await Organization.findOne({ _id: id, tenantId }).exec();
  if (!organization) {
    throw new AppError("Organization not found", 404);
  }

  return await Organization.deleteOne({ _id: id, tenantId }).exec();
};
