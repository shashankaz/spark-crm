import type { Task } from "@/types/domain";

export type TasksData = {
  tasks: Task[];
};

export type TaskData = {
  task: Task;
};

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

export type GetAllTasksResponse = {
  message: string;
  tasks: Task[];
};

export type GetTaskResponse = { message: string; task: Task };

export type CreateTaskResponse = { message: string; task: Task };

export type UpdateTaskResponse = { message: string; task: Task };

export type DeleteTaskResponse = { message: string };
