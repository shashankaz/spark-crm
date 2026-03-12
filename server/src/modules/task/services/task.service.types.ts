import { Types } from "mongoose";
import { TaskPriority, TaskStatus } from "../models/task.model.types";

export interface IFetchTasksInput {
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}

export interface IFetchTaskByIdInput {
  id: Types.ObjectId;
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
}

export interface ICreateTaskInput {
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: Date;
  reminderAt?: Date;
  labels?: string[];
}

export interface IUpdateTaskInput {
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

export interface IDeleteTaskInput {
  id: Types.ObjectId;
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
}
