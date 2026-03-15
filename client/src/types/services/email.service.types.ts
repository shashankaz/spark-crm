import type { IEmail } from "@/types/domain";

/**
 * API response types
 */

export type EmailsData = {
  emails: IEmail[];
  totalCount: number;
};

export type EmailData = {
  email: IEmail;
};

/**
 * Request types
 */

export type GetAllEmailsByLeadIdRequest = {
  leadId: string;
  cursor?: string;
  limit?: number;
  search?: string;
};

export type SendEmailForLeadRequest = {
  leadId: string;
  to: string;
  subject: string;
  bodyHtml: string;
  bodyText?: string;
  from?: string;
};

/**
 * Response types
 */

export type GetEmailsResponse = {
  message: string;
  emails: IEmail[];
  totalCount: number;
};

export type SendEmailResponse = {
  message: string;
  email: IEmail;
};
