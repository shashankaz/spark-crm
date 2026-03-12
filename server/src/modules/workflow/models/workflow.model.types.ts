import { Types, Document } from "mongoose";

export type WorkflowEntity = "lead" | "deal" | "organization";

export type WorkflowEvent =
  // lead events
  | "create"
  | "update"
  | "delete"
  // deal events
  | "won"
  | "lost"
  // organization events
  | "status_change";

export type WorkflowActionType = "send_email" | "notify_user" | "send_webhook";

export interface SendEmailActionConfig {
  to: string;
  subject: string;
  message: string;
}

export interface NotifyUserActionConfig {
  message: string;
  userIds?: string[];
}

export interface SendWebhookActionConfig {
  url: string;
  method?: "GET" | "POST" | "PUT" | "PATCH";
  headers?: Record<string, string>;
}

export type WorkflowActionConfig =
  | SendEmailActionConfig
  | NotifyUserActionConfig
  | SendWebhookActionConfig;

export interface WorkflowAction {
  type: WorkflowActionType;
  config: WorkflowActionConfig;
}

export interface WorkflowBase {
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  description?: string;
  active: boolean;
  entity: WorkflowEntity;
  event: WorkflowEvent;
  actions: WorkflowAction[];
  executionCount: number;
  lastExecutedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowDocument extends WorkflowBase, Document {
  _id: Types.ObjectId;
}
