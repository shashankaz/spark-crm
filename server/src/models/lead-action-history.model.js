import { Schema, model } from "mongoose";

const leadActionHistorySchema = Schema(
  {
    leadId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Lead",
    },
    actionType: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
    collection: "lead-action-history",
    versionKey: "version",
  },
);

leadActionHistorySchema.index({ leadId: 1 });

export const LeadActionHistory = model(
  "LeadActionHistory",
  leadActionHistorySchema,
);
