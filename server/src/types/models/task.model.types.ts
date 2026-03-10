import { Types, Document } from "mongoose";

export type TaskStatus = "todo" | "in_progress" | "completed" | "cancelled";

export type TaskPriority = "low" | "medium" | "high";

export interface TaskBase {
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;

  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  reminderAt?: Date;
  reminderSent: boolean;
  labels: string[];

  createdAt: Date;
  updatedAt: Date;
}

export interface TaskDocument extends TaskBase, Document {
  _id: Types.ObjectId;
}
