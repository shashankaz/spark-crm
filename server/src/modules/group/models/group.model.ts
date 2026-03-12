import { Schema, model } from "mongoose";
import { GroupDocument } from "./group.model.types";

const groupSchema = new Schema<GroupDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
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
    leads: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lead",
      },
    ],
  },
  {
    timestamps: true,
    collection: "groups",
    versionKey: "version",
  },
);

groupSchema.index({ tenantId: 1 });
groupSchema.index({ tenantId: 1, userId: 1 });

export const Group = model<GroupDocument>("Group", groupSchema);
