import { Types } from "mongoose";
import { ILeadBase } from "../models/lead.model.types";

export interface IFetchLeadsInput {
  tenantId: Types.ObjectId;
  cursor?: Types.ObjectId;
  limit: number;
  search?: string;
  userId?: Types.ObjectId;
  role?: string;
  assignment?: "all" | "assigned";
  scoreRange?: "any" | "low" | "medium" | "high";
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface IFetchLeadByIdInput {
  id: Types.ObjectId;
  tenantId: Types.ObjectId;
  userId?: Types.ObjectId;
  role?: string;
}

export interface ICreateLeadInput {
  idempotentId?: Types.UUID;
  tenantId: Types.ObjectId;
  orgId?: Types.ObjectId;
  orgName?: string;
  userId: Types.ObjectId;
  userName: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  gender?: string;
  source?: string;
}

export interface IUpdateLeadByIdInput {
  id: Types.ObjectId;
  tenantId: Types.ObjectId;
  orgId?: Types.ObjectId;
  orgName?: string;
  userId: Types.ObjectId;
  userName: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  gender?: string;
  source?: string;
  status?: string;
}

export interface IDeleteLeadByIdInput {
  id: Types.ObjectId;
  tenantId: Types.ObjectId;
}

export interface IBulkDeleteLeadsInput {
  leadIds: Types.ObjectId[];
  tenantId: Types.ObjectId;
}

export interface IBulkWriteLeadsInput {
  tenantId: Types.ObjectId;
  leads: ILeadBase[];
}

export interface IConvertLeadToDealInput {
  id: Types.ObjectId;
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
  userName: string;
  idempotentId?: Types.UUID;
  dealName?: string;
  value?: number;
  probability?: number;
}

export interface IFetchOrganizationsForLeadInput {
  tenantId: Types.ObjectId;
  limit: number;
  search?: string;
  userId?: Types.ObjectId;
  role?: string;
}

export interface IFetchLeadActivityByLeadIdInput {
  leadId: Types.ObjectId;
}

export interface IAssignLeadInput {
  leadId: Types.ObjectId;
  tenantId: Types.ObjectId;
  assignedUserId: Types.ObjectId;
  adminUserId: Types.ObjectId;
  adminUserName: string;
}
