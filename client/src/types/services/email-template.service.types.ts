import type { IEmailTemplate } from "@/types/domain";

export type EmailTemplatesData = {
  templates: IEmailTemplate[];
};

export type EmailTemplateData = {
  template: IEmailTemplate;
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
  templates: IEmailTemplate[];
};

export type GetEmailTemplateResponse = {
  message: string;
  template: IEmailTemplate;
};

export type CreateEmailTemplateResponse = {
  message: string;
  template: IEmailTemplate;
};

export type UpdateEmailTemplateResponse = {
  message: string;
  template: IEmailTemplate;
};

export type DeleteEmailTemplateResponse = { message: string };
