import { Types } from "mongoose";

export interface IFetchContactsInput {
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
  role: string;
  cursor?: Types.ObjectId;
  limit: number;
  search?: string;
  starred?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface IFetchContactByIdInput {
  id: Types.ObjectId;
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
  role: string;
}

export interface ICreateContactInput {
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
  orgId?: Types.ObjectId;
  orgName?: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  department?: string;
  linkedinUrl?: string;
  website?: string;
}

export interface IUpdateContactByIdInput {
  id: Types.ObjectId;
  tenantId: Types.ObjectId;
  orgId?: Types.ObjectId;
  orgName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  jobTitle?: string;
  department?: string;
  linkedinUrl?: string;
  website?: string;
}

export interface IToggleContactStarInput {
  id: Types.ObjectId;
  tenantId: Types.ObjectId;
}

export interface IDeleteContactByIdInput {
  id: Types.ObjectId;
  tenantId: Types.ObjectId;
}

export interface IBulkDeleteContactsInput {
  ids: Types.ObjectId[];
  tenantId: Types.ObjectId;
}

export interface IExportContactsInput {
  tenantId: Types.ObjectId;
  contactIds: string[];
  recipientEmail: string;
}
