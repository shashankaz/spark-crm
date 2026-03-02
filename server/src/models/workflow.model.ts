import { Schema, model } from "mongoose";
import { WorkflowDocument } from "../types/models/workflow.model.types";

const actionConfigSchema = new Schema({}, { strict: false, _id: false });

const actionSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["send_email", "notify_user", "send_webhook"],
    },
    config: {
      type: actionConfigSchema,
      default: {},
    },
  },
  { _id: false },
);

const workflowSchema = new Schema<WorkflowDocument>(
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
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    entity: {
      type: String,
      required: true,
      enum: ["lead", "deal", "organization"],
    },
    event: {
      type: String,
      required: true,
      enum: ["create", "update", "delete", "won", "lost", "status_change"],
    },
    actions: {
      type: [actionSchema],
      default: [],
    },
    executionCount: {
      type: Number,
      default: 0,
    },
    lastExecutedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    collection: "workflows",
    versionKey: "version",
  },
);

workflowSchema.index({ tenantId: 1, userId: 1 });

export const Workflow = model<WorkflowDocument>("Workflow", workflowSchema);
