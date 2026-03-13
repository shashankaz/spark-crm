import { Schema, model } from "mongoose";
import { IContactDocument } from "./contact.model.types";

const contactSchema = new Schema<IContactDocument>(
  {
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
    orgId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
    },
    orgName: {
      type: String,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    jobTitle: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    linkedinUrl: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    starred: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "contacts",
    versionKey: "version",
  },
);

contactSchema.index({ tenantId: 1, userId: 1 });
contactSchema.index({ tenantId: 1, starred: 1 });

contactSchema.pre("save", function () {
  if (this.email) this.email = this.email.toLowerCase();
});

export const Contact = model<IContactDocument>("Contact", contactSchema);
