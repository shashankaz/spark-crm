import type { Task } from "@/types/domain";

/**
 * API response types
 */

export type TasksData = {
  tasks: Task[];
  counts: TaskCounts;
};

export type TaskCounts = {
  all: number;
  todo: number;
  in_progress: number;
  completed: number;
};

export type TaskData = {
  task: Task;
};

/**
 * Request types
 */

export type GetAllTasksRequest = {
  search?: string;
  status?: string;
  priority?: string;
};

export type GetTaskRequest = { id: string };

export type CreateTaskRequest = {
  title: string;
  description?: string;
  priority?: string;
  dueDate?: string;
  reminderAt?: string;
  labels?: string[];
};

export type UpdateTaskRequest = {
  id: string;
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: string;
  reminderAt?: string;
  labels?: string[];
};

export type DeleteTaskRequest = { id: string };

/**
 * Response types
 */

export type GetAllTasksResponse = {
  message: string;
  tasks: Task[];
  counts: TaskCounts;
};

export type GetTaskResponse = { message: string; task: Task };

export type CreateTaskResponse = { message: string; task: Task };

export type UpdateTaskResponse = { message: string; task: Task };

export type DeleteTaskResponse = { message: string };
