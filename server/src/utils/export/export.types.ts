import { Types } from "mongoose";

export type ExportType = "lead" | "deal" | "organization" | "user" | "tenant";

export interface BaseExportJobPayload {
  type: ExportType;
  tenantId: Types.ObjectId;
  recipientEmail: string;
}

export interface LeadExportJobPayload extends BaseExportJobPayload {
  type: "lead";
  leadIds: Types.ObjectId[];
}

export interface DealExportJobPayload extends BaseExportJobPayload {
  type: "deal";
  dealIds: Types.ObjectId[];
}

export interface OrganizationExportJobPayload extends BaseExportJobPayload {
  type: "organization";
  organizationIds: Types.ObjectId[];
}

export interface UserExportJobPayload extends BaseExportJobPayload {
  type: "user";
  userIds: Types.ObjectId[];
}

export interface TenantExportJobPayload extends BaseExportJobPayload {
  type: "tenant";
  tenantIds: Types.ObjectId[];
}

export type ExportJobPayload =
  | LeadExportJobPayload
  | DealExportJobPayload
  | OrganizationExportJobPayload
  | UserExportJobPayload
  | TenantExportJobPayload;

export interface EnqueueLeadExportInput {
  tenantId: Types.ObjectId;
  leadIds: Types.ObjectId[];
  recipientEmail: string;
}

export interface EnqueueDealExportInput {
  tenantId: Types.ObjectId;
  dealIds: Types.ObjectId[];
  recipientEmail: string;
}

export interface EnqueueOrganizationExportInput {
  tenantId: Types.ObjectId;
  organizationIds: Types.ObjectId[];
  recipientEmail: string;
}

export interface EnqueueUserExportInput {
  tenantId: Types.ObjectId;
  userIds: Types.ObjectId[];
  recipientEmail: string;
}

export interface EnqueueTenantExportInput {
  tenantIds: Types.ObjectId[];
  recipientEmail: string;
}
