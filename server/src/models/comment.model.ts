import { Schema, model } from "mongoose";
import { CommentDocument } from "../types/models/comment.model.types";

const commentSchema = new Schema<CommentDocument>(
  {
    leadId: {
      type: Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "comments",
    versionKey: "version",
  },
);
commentSchema.index({ leadId: 1 });

export const Comment = model<CommentDocument>("Comment", commentSchema);
