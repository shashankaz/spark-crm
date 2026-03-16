import { Types, Document } from "mongoose";

export type TaskStatus = "todo" | "in_progress" | "completed";

export type TaskPriority = "low" | "medium" | "high";

export interface ITaskBase {
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

export interface ITaskDocument extends ITaskBase, Document {
  _id: Types.ObjectId;
}
