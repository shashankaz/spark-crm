import { Types } from "mongoose";

export interface IFetchOrganizationsInput {
  tenantId: Types.ObjectId;
  cursor?: Types.ObjectId;
  limit: number;
  search?: string;
  industry?: string;
  size?: string;
  country?: string;
}

export interface IFetchOrganizationByIdInput {
  id: Types.ObjectId;
  tenantId: Types.ObjectId;
}

export interface ICreateOrganizationInput {
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

export interface IUpdateOrganizationByIdInput {
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

export interface IDeleteOrganizationByIdInput {
  id: Types.ObjectId;
  tenantId: Types.ObjectId;
}
