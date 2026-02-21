import { Schema, model } from "mongoose";

const dealSchema = Schema(
  {
    idempotentId: {
      type: Schema.Types.UUID,
      required: true,
      unique: true,
    },
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    leadId: {
      type: Schema.Types.ObjectId,
      ref: "Lead",
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    value: {
      type: Number,
      default: 0,
    },
    probability: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
    collection: "deals",
    versionKey: "version",
  },
);

dealSchema.index({ tenantId: 1, leadId: 1 });

export const Deal = model("Deal", dealSchema);
