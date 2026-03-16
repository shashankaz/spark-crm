import { Request, Response } from "express";
import { Types } from "mongoose";
import {
  fetchTasksService,
  fetchTaskByIdService,
  createTaskService,
  updateTaskService,
  deleteTaskService,
} from "./services/task.service";
import { TaskStatus, TaskPriority } from "./models/task.model.types";
import { AppError } from "../../shared/app-error";
import { sendSuccess } from "../../shared/api-response";
import { asyncHandler } from "../../shared/async-handler";

export const getAllTasks = asyncHandler(async (req: Request, res: Response) => {
  const { tenantId, _id: userId } = req.user;
  if (!tenantId) {
    throw new AppError("Tenant ID is missing", 400);
  }

  const search = req.query.search as string | undefined;
  const status = req.query.status as string | undefined;
  const priority = req.query.priority as string | undefined;

  const { tasks, counts } = await fetchTasksService({
    tenantId,
    userId,
    search,
    status: status as TaskStatus,
    priority: priority as TaskPriority,
  });

  sendSuccess(res, 200, "Tasks retrieved successfully", { tasks, counts });
});

export const getTaskById = asyncHandler(async (req: Request, res: Response) => {
  const { tenantId, _id: userId } = req.user;
  if (!tenantId) {
    throw new AppError("Tenant ID is missing", 400);
  }

  const id = req.params.id as unknown as Types.ObjectId;
  if (!id) {
    throw new AppError("Task ID is required", 400);
  }

  const task = await fetchTaskByIdService({ id, tenantId, userId });

  sendSuccess(res, 200, "Task retrieved successfully", { task });
});

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const { tenantId, _id: userId } = req.user;
  if (!tenantId) {
    throw new AppError("Tenant ID is missing", 400);
  }

  const { title, description, priority, dueDate, reminderAt, labels } =
    req.body;
  if (!title) {
    throw new AppError("Title is required", 400);
  }

  const task = await createTaskService({
    tenantId,
    userId,
    title,
    description,
    priority,
    dueDate: dueDate ? new Date(dueDate) : undefined,
    reminderAt: reminderAt ? new Date(reminderAt) : undefined,
    labels,
  });

  sendSuccess(res, 201, "Task created successfully", { task });
});

export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const { tenantId, _id: userId } = req.user;
  if (!tenantId) {
    throw new AppError("Tenant ID is missing", 400);
  }

  const id = req.params.id as unknown as Types.ObjectId;
  if (!id) {
    throw new AppError("Task ID is required", 400);
  }

  const { title, description, status, priority, dueDate, reminderAt, labels } =
    req.body;

  const task = await updateTaskService({
    id,
    tenantId,
    userId,
    title,
    description,
    status: status as TaskStatus,
    priority: priority as TaskPriority,
    dueDate: dueDate ? new Date(dueDate) : undefined,
    reminderAt: reminderAt ? new Date(reminderAt) : undefined,
    labels,
  });

  sendSuccess(res, 200, "Task updated successfully", { task });
});

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const { tenantId, _id: userId } = req.user;
  if (!tenantId) {
    throw new AppError("Tenant ID is missing", 400);
  }

  const id = req.params.id as unknown as Types.ObjectId;
  if (!id) {
    throw new AppError("Task ID is required", 400);
  }

  await deleteTaskService({ id, tenantId, userId });

  sendSuccess(res, 200, "Task deleted successfully", { id });
});
