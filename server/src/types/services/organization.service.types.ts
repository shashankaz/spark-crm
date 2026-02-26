export interface FetchOrganizationsInput {
  tenantId: string;
  cursor?: string;
  limit: number;
  search?: string;
}

export interface FetchOrganizationByIdInput {
  id: string;
  tenantId: string;
}

export interface CreateOrganizationInput {
  idempotentId?: string;
  tenantId: string;
  userId?: string;
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
  id: string;
  tenantId: string;
  userId?: string;
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
  id: string;
  tenantId: string;
}
