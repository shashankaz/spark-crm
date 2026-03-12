import { Schema, model } from "mongoose";
import { ICommentDocument } from "./comment.model.types";

const commentSchema = new Schema<ICommentDocument>(
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
commentSchema.index({ comment: "text" });

export const Comment = model<ICommentDocument>("Comment", commentSchema);
