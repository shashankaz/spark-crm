export interface FetchLeadsInput {
  tenantId: string;
  cursor?: string;
  limit: number;
  search?: string;
}

export interface FetchLeadByIdInput {
  id: string;
  tenantId: string;
}

export interface CreateLeadInput {
  idempotentId?: string;
  tenantId: string;
  orgId?: string;
  orgName?: string;
  userId?: string;
  userName: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  gender?: string;
  source?: string;
}

export interface UpdateLeadByIdInput {
  id: string;
  tenantId: string;
  orgId?: string;
  orgName?: string;
  userId?: string;
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
  id: string;
  tenantId: string;
  userId: string;
  userName: string;
}

export interface BulkWriteLeadsInput {
  tenantId: string;
  leads: any[];
}

export interface ConvertLeadToDealInput {
  id: string;
  tenantId: string;
  userId: string;
  userName: string;
  idempotentId?: string;
  dealName?: string;
  value?: number;
  probability?: number;
}

export interface FetchOrganizationsForLeadInput {
  tenantId: string;
  limit: number;
  search?: string;
}

export interface FetchLeadActivityByLeadIdInput {
  leadId: string;
}
