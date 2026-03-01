import type { Deal, Lead, LeadActionHistory } from "@/types/domain";

export type LeadsData = {
  leads: Lead[];
  totalCount: number;
};

export type LeadData = {
  lead: Lead;
};

export type UpdatedLeadData = {
  updatedLead: Lead;
};

export type DeletedLeadData = {
  id: string;
};

export type LeadOrganizationsData = {
  organizations: { _id: string; name: string }[];
};

export type ActivitiesData = {
  activities: LeadActionHistory[];
};

export type LeadDealData = {
  deal: Deal;
};

export type GetAllLeadsRequest = {
  cursor?: string;
  limit?: number;
  search?: string;
  orgId?: string;
};

export type GetLeadByIdRequest = {
  id: string;
};

export type CreateLeadRequest = {
  idempotentId: string;
  orgId: string;
  orgName: string;
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

export type GetAllLeadsResponse = {
  message: string;
  leads: Lead[];
  totalCount: number;
};

export type GetLeadByIdResponse = {
  message: string;
  lead: Lead;
};

export type CreateLeadResponse = {
  message: string;
  lead: Lead;
};

export type UpdateLeadResponse = {
  message: string;
  lead: Lead;
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
  activities: LeadActionHistory[];
};

export type ConvertLeadToDealResponse = {
  message: string;
  deal: Deal;
};

export type AssignLeadResponse = {
  message: string;
  lead: Lead;
};
