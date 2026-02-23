import { Schema, model } from "mongoose";

const commentSchema = Schema(
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

export const Comment = model("Comment", commentSchema);
