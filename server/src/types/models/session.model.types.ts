import { Types, Document } from "mongoose";

export interface SessionBase {
  userId: Types.ObjectId;
  token?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionDocument extends SessionBase, Document {
  _id: Types.ObjectId;
}
