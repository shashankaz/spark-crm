import type { IContact } from "@/types/domain";

export type ContactsData = {
  contacts: IContact[];
  totalCount: number;
};

export type ContactData = {
  contact: IContact;
};

export type UpdatedContactData = {
  updatedContact: IContact;
};

export type DeletedContactData = {
  id: string;
};

export type BulkDeleteContactsData = {
  deletedCount: number;
};

/**
 * Request Types
 */

export type GetAllContactsRequest = {
  cursor?: string;
  limit?: number;
  search?: string;
  starred?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export type GetContactByIdRequest = {
  id: string;
};

export type CreateContactRequest = {
  orgId?: string;
  orgName?: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  department?: string;
  linkedinUrl?: string;
  website?: string;
};

export type UpdateContactByIdRequest = {
  id: string;
  orgId?: string;
  orgName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  jobTitle?: string;
  department?: string;
  linkedinUrl?: string;
  website?: string;
};

export type ToggleContactStarRequest = {
  id: string;
};

export type DeleteContactByIdRequest = {
  id: string;
};

export type BulkDeleteContactsRequest = {
  ids: string[];
};

/**
 * Response Types
 */

export type GetAllContactsResponse = {
  message: string;
  contacts: IContact[];
  totalCount: number;
};

export type GetContactByIdResponse = {
  message: string;
  contact: IContact;
};

export type CreateContactResponse = {
  message: string;
  contact: IContact;
};

export type UpdateContactResponse = {
  message: string;
  updatedContact: IContact;
};

export type ToggleContactStarResponse = {
  message: string;
  contact: IContact;
};

export type DeleteContactResponse = {
  message: string;
  id: string;
};

export type BulkDeleteContactsResponse = {
  message: string;
  deletedCount: number;
};
