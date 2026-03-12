import { Schema, model } from "mongoose";
import { EmailDocument } from "./email.model.types";

const emailSchema = new Schema<EmailDocument>(
  {
    leadId: {
      type: Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    bodyHtml: {
      type: String,
      required: true,
    },
    bodyText: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["sent", "failed", "draft"],
      default: "draft",
    },
    trackingId: {
      type: Schema.Types.ObjectId,
      ref: "Tracking",
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "emails",
    versionKey: "version",
  },
);

emailSchema.index({ leadId: 1 });

export const Email = model<EmailDocument>("Email", emailSchema);
