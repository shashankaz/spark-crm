import { Types, Document } from "mongoose";

export interface IGroupBase {
  name: string;
  description?: string;

  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
  leads: Types.ObjectId[];

  createdAt: Date;
  updatedAt: Date;
}

export interface IGroupDocument extends IGroupBase, Document {
  _id: Types.ObjectId;
}
