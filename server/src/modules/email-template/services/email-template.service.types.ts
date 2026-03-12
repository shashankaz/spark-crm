import { Types } from "mongoose";

export interface FetchEmailTemplatesInput {
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
  search?: string;
  tag?: string;
}

export interface GetEmailTemplateByIdInput {
  id: Types.ObjectId;
  tenantId: Types.ObjectId;
}

export interface CreateEmailTemplateInput {
  name: string;
  subject: string;
  bodyHtml: string;
  tags?: string[];
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
}

export interface UpdateEmailTemplateInput {
  id: Types.ObjectId;
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
  name?: string;
  subject?: string;
  bodyHtml?: string;
  tags?: string[];
}

export interface DeleteEmailTemplateInput {
  id: Types.ObjectId;
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
}
