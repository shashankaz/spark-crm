import { Types, Document } from "mongoose";

export interface IContactBase {
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;

  orgId?: Types.ObjectId;
  orgName?: string;

  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;

  jobTitle?: string;
  department?: string;

  linkedinUrl?: string;
  website?: string;

  starred: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export interface IContactDocument extends IContactBase, Document {
  _id: Types.ObjectId;
}
