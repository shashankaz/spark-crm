import { Schema, model } from "mongoose";
import { WebhookTokenDocument } from "./webhook-token.model.types";

const webhookTokenSchema = new Schema<WebhookTokenDocument>(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Tenant",
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      select: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    lastUsedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    collection: "webhook-tokens",
    versionKey: "version",
  },
);

webhookTokenSchema.index({ tenantId: 1 });

export const WebhookToken = model<WebhookTokenDocument>(
  "WebhookToken",
  webhookTokenSchema,
);
