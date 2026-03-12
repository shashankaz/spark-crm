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

export interface ISendEmailActionConfig {
  to: string;
  subject: string;
  message: string;
}

export interface INotifyUserActionConfig {
  message: string;
  userIds?: string[];
}

export interface ISendWebhookActionConfig {
  url: string;
  method?: "GET" | "POST" | "PUT" | "PATCH";
  headers?: Record<string, string>;
}

export type WorkflowActionConfig =
  | ISendEmailActionConfig
  | INotifyUserActionConfig
  | ISendWebhookActionConfig;

export interface IWorkflowAction {
  type: WorkflowActionType;
  config: WorkflowActionConfig;
}

export interface IWorkflowBase {
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  description?: string;
  active: boolean;
  entity: WorkflowEntity;
  event: WorkflowEvent;
  actions: IWorkflowAction[];
  executionCount: number;
  lastExecutedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IWorkflowDocument extends IWorkflowBase, Document {
  _id: Types.ObjectId;
}
