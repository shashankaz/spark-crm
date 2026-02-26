import { Types, Document } from "mongoose";

export interface CommentBase {
  leadId: Types.ObjectId;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommentDocument extends CommentBase, Document {
  _id: Types.ObjectId;
}
