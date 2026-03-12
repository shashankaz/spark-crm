import { Types, Document } from "mongoose";

export interface EmailTemplateBase {
  name: string;
  subject: string;
  bodyHtml: string;
  tags: string[];

  tenantId: Types.ObjectId;
  userId: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

export interface EmailTemplateDocument extends EmailTemplateBase, Document {
  _id: Types.ObjectId;
}
