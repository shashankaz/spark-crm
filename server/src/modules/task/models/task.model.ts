import { Schema, model } from "mongoose";
import { ITaskDocument } from "./task.model.types";

const taskSchema = new Schema<ITaskDocument>(
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
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["todo", "in_progress", "completed"],
      default: "todo",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: {
      type: Date,
    },
    reminderAt: {
      type: Date,
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
    labels: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: "tasks",
    versionKey: "version",
  },
);

taskSchema.index({ tenantId: 1, userId: 1 });
taskSchema.index({ reminderAt: 1, reminderSent: 1 });

export const Task = model<ITaskDocument>("Task", taskSchema);
