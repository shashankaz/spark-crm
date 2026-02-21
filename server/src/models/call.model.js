import { Schema, model } from "mongoose";

const callSchema = Schema(
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

callSchema.index({ tenantId: 1, leadId: 1 });

export const Call = model("Call", callSchema);
