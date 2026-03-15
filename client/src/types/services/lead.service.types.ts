import type { IDeal, ILead, ILeadActionHistory } from "@/types/domain";

/**
 * API response types
 */

export type LeadsData = {
  leads: ILead[];
  totalCount: number;
};

export type LeadData = {
  lead: ILead;
};

export type UpdatedLeadData = {
  updatedLead: ILead;
};

export type DeletedLeadData = {
  id: string;
};

export type LeadOrganizationsData = {
  organizations: { _id: string; name: string }[];
};

export type ActivitiesData = {
  activities: ILeadActionHistory[];
};

export type LeadDealData = {
  deal: IDeal;
};

export type BulkDeleteLeadsData = {
  deleted: number;
};

export type ExportLeadsData = {
  messageId: string;
  leadCount: number;
  recipientEmail: string;
};

export type ImportLeadsData = {
  inserted: number;
  failed: number;
  failedLeadIds: string[];
};

export type LeadResearchResult = {
  firstName: string;
  lastName?: string;
  email: string;
  mobile: string;
  gender: "male" | "female" | "other";
  orgName?: string;
  source?: string;
  score: number;
  status: "new" | "contacted" | "qualified" | "converted" | "lost";
  summary: string;
};

export type ResearchLeadData = {
  result: LeadResearchResult;
};

/**
 * Request types
 */

export type GetAllLeadsRequest = {
  cursor?: string;
  limit?: number;
  search?: string;
  assignment?: "all" | "assigned";
  scoreRange?: "any" | "low" | "medium" | "high";
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export type BulkDeleteLeadsRequest = {
  leadIds: string[];
};

export type GetLeadByIdRequest = {
  id: string;
};

export type CreateLeadRequest = {
  idempotentId: string;
  orgId?: string;
  orgName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  gender?: string;
  source?: string;
};

export type UpdateLeadByIdRequest = {
  id: string;
  orgId?: string;
  orgName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  gender?: string;
  source?: string;
  status?: string;
};

export type DeleteLeadByIdRequest = {
  id: string;
};

export type GetLeadActivityByLeadIdRequest = {
  id: string;
};

export type ConvertLeadToDealRequest = {
  id: string;
  idempotentId: string;
  dealName?: string;
  value?: number;
  probability?: number;
};

export type GetLeadOrganizationsRequest = {
  limit?: number;
  search?: string;
};

export type AssignLeadRequest = {
  id: string;
  assignedUserId: string;
};

export type ExportLeadsRequest = {
  leadIds: string[];
  recipientEmail: string;
};

export type ImportLeadsRequest = {
  file: File;
};

export type ResearchLeadRequest = {
  query: string;
};

/**
 * Response types
 */

export type BulkDeleteLeadsResponse = {
  message: string;
  deleted: number;
};

export type GetAllLeadsResponse = {
  message: string;
  leads: ILead[];
  totalCount: number;
};

export type GetLeadByIdResponse = {
  message: string;
  lead: ILead;
};

export type CreateLeadResponse = {
  message: string;
  lead: ILead;
};

export type UpdateLeadResponse = {
  message: string;
  lead: ILead;
};

export type DeleteLeadResponse = {
  message: string;
  id: string;
};

export type GetLeadOrganizationsResponse = {
  message: string;
  organizations: { _id: string; name: string }[];
};

export type GetLeadActivityByLeadIdResponse = {
  message: string;
  activities: ILeadActionHistory[];
};

export type ConvertLeadToDealResponse = {
  message: string;
  deal: IDeal;
};

export type AssignLeadResponse = {
  message: string;
  lead: ILead;
};

export type ExportLeadsResponse = {
  message: string;
  messageId: string;
  leadCount: number;
  recipientEmail: string;
};

export type ImportLeadsResponse = {
  message: string;
  inserted: number;
  failed: number;
  failedLeadIds: string[];
};

export type ResearchLeadResponse = {
  message: string;
  result: LeadResearchResult;
};
