import { Types } from "mongoose";

export interface FetchOrganizationsInput {
  tenantId: Types.ObjectId;
  cursor?: Types.ObjectId;
  limit: number;
  search?: string;
}

export interface FetchOrganizationByIdInput {
  id: Types.ObjectId;
  tenantId: Types.ObjectId;
}

export interface CreateOrganizationInput {
  idempotentId?: Types.UUID;
  tenantId: Types.ObjectId;
  userId?: Types.ObjectId;
  name: string;
  industry?: string;
  size?: string;
  country?: string;
  email?: string;
  mobile?: string;
  website?: string;
  contactName?: string;
  contactEmail?: string;
  contactMobile?: string;
}

export interface UpdateOrganizationByIdInput {
  id: Types.ObjectId;
  tenantId: Types.ObjectId;
  userId?: Types.ObjectId;
  name?: string;
  industry?: string;
  size?: string;
  country?: string;
  email?: string;
  mobile?: string;
  website?: string;
  contactName?: string;
  contactEmail?: string;
  contactMobile?: string;
}

export interface DeleteOrganizationByIdInput {
  id: Types.ObjectId;
  tenantId: Types.ObjectId;
}
