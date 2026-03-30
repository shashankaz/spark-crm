export type WorkflowActionType =
  | "send_email"
  | "add_task"
  | "add_task_with_reminder";

export interface IWorkflowAction {
  type: WorkflowActionType;
  config: Record<string, unknown>;
}

export interface IWorkflow {
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
}
