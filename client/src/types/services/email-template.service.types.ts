import type { EmailTemplate } from "@/types/domain";

export type EmailTemplatesData = {
  templates: EmailTemplate[];
};

export type EmailTemplateData = {
  template: EmailTemplate;
};

export type GetAllEmailTemplatesRequest = {
  search?: string;
  tag?: string;
};

export type GetEmailTemplateRequest = { id: string };

export type CreateEmailTemplateRequest = {
  name: string;
  subject: string;
  bodyHtml: string;
  tags?: string[];
};

export type UpdateEmailTemplateRequest = {
  id: string;
  name?: string;
  subject?: string;
  bodyHtml?: string;
  tags?: string[];
};

export type DeleteEmailTemplateRequest = { id: string };

export type GetAllEmailTemplatesResponse = {
  message: string;
  templates: EmailTemplate[];
};

export type GetEmailTemplateResponse = {
  message: string;
  template: EmailTemplate;
};

export type CreateEmailTemplateResponse = {
  message: string;
  template: EmailTemplate;
};

export type UpdateEmailTemplateResponse = {
  message: string;
  template: EmailTemplate;
};

export type DeleteEmailTemplateResponse = { message: string };
