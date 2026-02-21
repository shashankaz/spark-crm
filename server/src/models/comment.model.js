import { Schema, model } from "mongoose";

const commentSchema = Schema(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
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
commentSchema.index({ tenantId: 1, leadId: 1 });

export const Comment = model("Comment", commentSchema);
