import { Types, Document } from "mongoose";

export interface ISessionBase {
  userId: Types.ObjectId;
  token?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISessionDocument extends ISessionBase, Document {
  _id: Types.ObjectId;
}
