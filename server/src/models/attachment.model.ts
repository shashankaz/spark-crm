import { Schema, model } from "mongoose";
import { AttachmentDocument } from "../types/models/attachment.model.types";

const attachmentSchema = new Schema<AttachmentDocument>(
  {
    leadId: {
      type: Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "attachments",
    versionKey: "version",
  },
);

attachmentSchema.index({ leadId: 1 });

export const Attachment = model<AttachmentDocument>(
  "Attachment",
  attachmentSchema,
);
