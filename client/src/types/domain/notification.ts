export type NotificationType = "info" | "success" | "warning" | "error";

export type NotificationCategory =
  | "lead"
  | "deal"
  | "task"
  | "call"
  | "email"
  | "comment"
  | "workflow"
  | "system"
  | "user";

export type Notification = {
  _id: string;
  tenantId: string;
  userId?: string | null;
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  isRead: boolean;
  link?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};
