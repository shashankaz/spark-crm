import { Types } from "mongoose";
import { TaskPriority, TaskStatus } from "../models/task.model.types";

export interface FetchTasksInput {
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}

export interface FetchTaskByIdInput {
  id: Types.ObjectId;
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
}

export interface CreateTaskInput {
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: Date;
  reminderAt?: Date;
  labels?: string[];
}

export interface UpdateTaskInput {
  id: Types.ObjectId;
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: Date;
  reminderAt?: Date;
  labels?: string[];
}

export interface DeleteTaskInput {
  id: Types.ObjectId;
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
}
