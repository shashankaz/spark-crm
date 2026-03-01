import type { Email } from "@/types/domain";

export type EmailsData = {
  emails: Email[];
  totalCount: number;
};

export type EmailData = {
  email: Email;
};

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

export type GetEmailsResponse = {
  message: string;
  emails: Email[];
  totalCount: number;
};

export type SendEmailResponse = {
  message: string;
  email: Email;
};
