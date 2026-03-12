import { Types } from "mongoose";
import { Task } from "../models/task.model";
import { AppError } from "../../../shared/app-error";
import {
  IFetchTasksInput,
  IFetchTaskByIdInput,
  ICreateTaskInput,
  IUpdateTaskInput,
  IDeleteTaskInput,
} from "./task.service.types";
import { TaskStatus, TaskPriority } from "../models/task.model.types";
import { sendTaskReminderMail } from "../../../utils/mail/email.helper";

export const fetchTasksService = async ({
  tenantId,
  userId,
  search,
  status,
  priority,
}: IFetchTasksInput) => {
  const query: any = { tenantId, userId };

  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const tasks = await Task.find(query).sort({ createdAt: -1 }).exec();

  return { tasks };
};

export const fetchTaskByIdService = async ({
  id,
  tenantId,
  userId,
}: IFetchTaskByIdInput) => {
  const task = await Task.findOne({ _id: id, tenantId, userId }).exec();
  if (!task) {
    throw new AppError("Task not found", 404);
  }

  return task;
};

export const createTaskService = async ({
  tenantId,
  userId,
  title,
  description,
  priority,
  dueDate,
  reminderAt,
  labels,
}: ICreateTaskInput) => {
  const task = new Task({
    tenantId,
    userId,
    title,
    description,
    priority: priority ?? "medium",
    dueDate,
    reminderAt,
    reminderSent: false,
    labels: labels ?? [],
  });

  return await task.save();
};

export const updateTaskService = async ({
  id,
  tenantId,
  userId,
  title,
  description,
  status,
  priority,
  dueDate,
  reminderAt,
  labels,
}: IUpdateTaskInput) => {
  const task = await Task.findOne({ _id: id, tenantId, userId }).exec();
  if (!task) {
    throw new AppError("Task not found", 404);
  }

  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (status !== undefined) task.status = status as TaskStatus;
  if (priority !== undefined) task.priority = priority as TaskPriority;
  if (dueDate !== undefined) task.dueDate = dueDate;
  if (labels !== undefined) task.labels = labels;

  if (reminderAt !== undefined) {
    task.reminderAt = reminderAt;
    task.reminderSent = false;
  }

  return await task.save();
};

export const deleteTaskService = async ({
  id,
  tenantId,
  userId,
}: IDeleteTaskInput) => {
  const task = await Task.findOneAndDelete({
    _id: id,
    tenantId,
    userId,
  }).exec();
  if (!task) {
    throw new AppError("Task not found", 404);
  }

  return task;
};

export const processTaskRemindersService = async (): Promise<void> => {
  const now = new Date();

  const dueTasks = await Task.find({
    reminderAt: { $lte: now },
    reminderSent: false,
    status: { $nin: ["completed", "cancelled"] },
  })
    .populate<{ userId: { email: string; firstName: string } }>(
      "userId",
      "email firstName",
    )
    .exec();

  let sent = 0;

  for (const task of dueTasks) {
    const user = task.userId as Types.ObjectId & {
      email: string;
      firstName: string;
    };
    if (!user?.email) continue;

    try {
      await sendTaskReminderMail({
        userEmail: user.email,
        userFirstName: user.firstName,
        taskTitle: task.title,
        taskDescription: task.description,
        dueDate: task.dueDate?.toISOString(),
      });

      task.reminderSent = true;
      await task.save();
      sent++;
    } catch (err) {
      console.error(`[TaskReminder] Failed for task ${task._id}:`, err);
    }
  }

  console.log(
    `[TaskReminder] Sent ${sent}/${dueTasks.length} reminder emails.`,
  );
};
