import type { Organization } from "@/types/domain";

/**
 * API response types
 */

export type OrganizationsData = {
  organizations: Organization[];
  totalCount: number;
};

export type OrganizationData = {
  organization: Organization;
};

export type UpdatedOrganizationData = {
  updatedOrganization: Organization;
};

export type DeletedOrganizationData = {
  id: string;
};

export type ExportOrganizationsData = {
  messageId: string;
  organizationCount: number;
  recipientEmail: string;
};

/**
 * Request types
 */

export type GetAllOrganizationsRequest = {
  cursor?: string;
  limit?: number;
  search?: string;
  industry?: string;
  size?: string;
  country?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export type GetOrganizationByIdRequest = {
  id: string;
};

export type CreateOrganizationRequest = {
  idempotentId: string;
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
};

export type UpdateOrganizationByIdRequest = {
  id: string;
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
};

export type DeleteOrganizationByIdRequest = {
  id: string;
};

export type ExportOrganizationsRequest = {
  organizationIds: string[];
  recipientEmail: string;
};

/**
 * Response types
 */

export type GetAllOrganizationsResponse = {
  message: string;
  organizations: Organization[];
  totalCount: number;
};

export type GetOrganizationByIdResponse = {
  message: string;
  organization: Organization;
};

export type CreateOrganizationResponse = {
  message: string;
  organization: Organization;
};

export type UpdateOrganizationResponse = {
  message: string;
  updatedOrganization: Organization;
};

export type DeleteOrganizationResponse = {
  message: string;
  id: string;
};

export type ExportOrganizationsResponse = {
  message: string;
  messageId: string;
  organizationCount: number;
  recipientEmail: string;
};
