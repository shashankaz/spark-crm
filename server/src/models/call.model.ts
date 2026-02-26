import { Schema, model } from "mongoose";
import { CallDocument } from "../types/models/call.model.types";

const callSchema = new Schema<CallDocument>(
  {
    leadId: {
      type: Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
    },
    type: {
      type: String,
      enum: ["inbound", "outbound"],
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    from: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["completed", "missed", "cancelled"],
      required: true,
    },
    duration: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
    collection: "calls",
    versionKey: "version",
  },
);

callSchema.index({ leadId: 1 });

export const Call = model<CallDocument>("Call", callSchema);
