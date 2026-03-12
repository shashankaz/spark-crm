import { Types, Document } from "mongoose";

export interface IEmailTemplateBase {
  name: string;
  subject: string;
  bodyHtml: string;
  tags: string[];

  tenantId: Types.ObjectId;
  userId: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

export interface IEmailTemplateDocument extends IEmailTemplateBase, Document {
  _id: Types.ObjectId;
}
