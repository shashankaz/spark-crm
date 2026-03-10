import { Schema, model } from "mongoose";
import { EmailTemplateDocument } from "../types/models/email-template.model.types";

const emailTemplateSchema = new Schema<EmailTemplateDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    bodyHtml: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    tenantId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Tenant",
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
    collection: "email_templates",
    versionKey: "version",
  },
);

emailTemplateSchema.index({ tenantId: 1 });
emailTemplateSchema.index({ tenantId: 1, userId: 1 });

export const EmailTemplate = model<EmailTemplateDocument>(
  "EmailTemplate",
  emailTemplateSchema,
);
