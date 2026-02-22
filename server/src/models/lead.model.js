import { Schema, model } from "mongoose";

const leadSchema = Schema(
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
    orgId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
    },
    orgName: {
      type: String,
      trim: true,
    },
    dealId: {
      type: Schema.Types.ObjectId,
      ref: "Deal",
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
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
    mobile: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    source: {
      type: String,
      trim: true,
    },
    score: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: "new",
      enum: ["new", "contacted", "qualified", "converted", "lost"],
    },
  },
  {
    timestamps: true,
    collection: "leads",
    versionKey: "version",
  },
);

leadSchema.index({ tenantId: 1, userId: 1 });

leadSchema.pre("save", async function () {
  this.email = this.email.toLowerCase();
});

export const Lead = model("Lead", leadSchema);
