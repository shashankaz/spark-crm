import { Schema, model } from "mongoose";
import { LeadActionHistoryDocument } from "../types/models/lead-action-history.model.types";

const leadActionHistorySchema = new Schema<LeadActionHistoryDocument>(
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

export const LeadActionHistory = model<LeadActionHistoryDocument>(
  "LeadActionHistory",
  leadActionHistorySchema,
);
