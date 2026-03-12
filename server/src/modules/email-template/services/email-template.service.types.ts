import { Types } from "mongoose";

export interface IFetchEmailTemplatesInput {
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
  search?: string;
  tag?: string;
}

export interface IGetEmailTemplateByIdInput {
  id: Types.ObjectId;
  tenantId: Types.ObjectId;
}

export interface ICreateEmailTemplateInput {
  name: string;
  subject: string;
  bodyHtml: string;
  tags?: string[];
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
}

export interface IUpdateEmailTemplateInput {
  id: Types.ObjectId;
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
  name?: string;
  subject?: string;
  bodyHtml?: string;
  tags?: string[];
}

export interface IDeleteEmailTemplateInput {
  id: Types.ObjectId;
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
}
