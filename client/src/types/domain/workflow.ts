export type WorkflowActionType =
  | "send_email"
  | "create_task"
  | "notify_user"
  | "assign_lead"
  | "update_status"
  | "send_webhook";

export interface IWorkflowAction {
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
  actions: IWorkflowAction[];
  executionCount: number;
  lastExecutedAt?: string;

  createdAt: string;
  updatedAt: string;
};
