export type WorkflowActionType =
  | "send_email"
  | "create_task"
  | "notify_user"
  | "assign_lead"
  | "update_status"
  | "send_webhook";

export interface WorkflowAction {
  type: WorkflowActionType;
  config: Record<string, unknown>;
}

export type Workflow = {
  _id: string;

  name: string;
  description?: string;
  active: boolean;
  entity: "lead" | "deal" | "organization";
  event: string;
  actions: WorkflowAction[];
  executionCount: number;
  lastExecutedAt?: string;

  createdAt: string;
  updatedAt: string;
};
