import { Types } from "mongoose";

export interface FetchLeadsInput {
  tenantId: Types.ObjectId;
  cursor?: Types.ObjectId;
  limit: number;
  search?: string;
  orgId?: Types.ObjectId;
  userId?: Types.ObjectId;
  role?: string;
}

export interface FetchLeadByIdInput {
  id: Types.ObjectId;
  tenantId: Types.ObjectId;
  userId?: Types.ObjectId;
  role?: string;
}

export interface CreateLeadInput {
  idempotentId?: Types.UUID;
  tenantId: Types.ObjectId;
  orgId?: Types.ObjectId;
  orgName?: string;
  userId?: Types.ObjectId;
  userName: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  gender?: string;
  source?: string;
}

export interface UpdateLeadByIdInput {
  id: Types.ObjectId;
  tenantId: Types.ObjectId;
  orgId?: Types.ObjectId;
  orgName?: string;
  userId?: Types.ObjectId;
  userName: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  gender?: string;
  source?: string;
  status?: string;
}

export interface DeleteLeadByIdInput {
  id: Types.ObjectId;
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
  userName: string;
}

export interface BulkWriteLeadsInput {
  tenantId: Types.ObjectId;
  leads: string[];
}

export interface ConvertLeadToDealInput {
  id: Types.ObjectId;
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
  userName: string;
  idempotentId?: Types.UUID;
  dealName?: string;
  value?: number;
  probability?: number;
}

export interface FetchOrganizationsForLeadInput {
  tenantId: Types.ObjectId;
  limit: number;
  search?: string;
  userId?: Types.ObjectId;
  role?: string;
}

export interface FetchLeadActivityByLeadIdInput {
  leadId: Types.ObjectId;
}

export interface AssignLeadInput {
  leadId: Types.ObjectId;
  tenantId: Types.ObjectId;
  assignedUserId: Types.ObjectId;
  adminUserId: Types.ObjectId;
  adminUserName: string;
}
