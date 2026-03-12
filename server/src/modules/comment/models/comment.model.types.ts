import { Types, Document } from "mongoose";

export interface ICommentBase {
  leadId: Types.ObjectId;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICommentDocument extends ICommentBase, Document {
  _id: Types.ObjectId;
}
