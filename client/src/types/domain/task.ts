export type TaskStatus = "todo" | "in_progress" | "completed" | "cancelled";

export type TaskPriority = "low" | "medium" | "high";

export type Task = {
  _id: string;

  tenantId: string;
  userId: string;

  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  reminderAt?: string;
  reminderSent: boolean;
  labels: string[];

  createdAt: string;
  updatedAt: string;
};
