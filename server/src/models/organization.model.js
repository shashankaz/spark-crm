import { Schema, model } from "mongoose";

const organizationSchema = Schema(
  {
    idempotentId: {
      type: Schema.Types.UUID,
      required: true,
      unique: true,
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
    name: {
      type: String,
      required: true,
      trim: true,
    },
    industry: {
      type: String,
      enum: [
        "technology",
        "finance",
        "healthcare",
        "education",
        "retail",
        "manufacturing",
        "real estate",
        "other",
      ],
    },
    size: {
      type: String,
      enum: ["smb", "mid-market", "enterprise"],
    },
    country: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    mobile: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    contactName: {
      type: String,
      trim: true,
    },
    contactEmail: {
      type: String,
      trim: true,
    },
    contactMobile: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: "organizations",
    versionKey: "version",
  },
);

export const Organization = model("Organization", organizationSchema);
