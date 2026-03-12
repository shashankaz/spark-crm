import { Types, Document } from "mongoose";

export interface GroupBase {
  name: string;
  description?: string;

  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
  leads: Types.ObjectId[];

  createdAt: Date;
  updatedAt: Date;
}

export interface GroupDocument extends GroupBase, Document {
  _id: Types.ObjectId;
}
