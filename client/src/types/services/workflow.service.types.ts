import type { Workflow } from "@/types/domain";

export type WorkflowsData = {
  workflows: Workflow[];
  totalCount: number;
};

export type WorkflowData = {
  workflow: Workflow;
};

export type DeletedWorkflowData = {
  id: string;
};

export type GetAllWorkflowsRequest = {
  cursor?: string;
  limit?: number;
  search?: string;
};

export type GetWorkflowByIdRequest = {
  id: string;
};

export type DeleteWorkflowRequest = {
  id: string;
};

export type ToggleWorkflowRequest = {
  id: string;
};

export interface IWorkflowActionPayload {
  type: string;
  config: Record<string, unknown>;
}

export interface ICreateWorkflowPayload {
  name: string;
  description?: string;
  active?: boolean;
  entity: string;
  event: string;
  actions?: IWorkflowActionPayload[];
}

export interface IUpdateWorkflowPayload extends Partial<ICreateWorkflowPayload> {
  id: string;
}

export type GetAllWorkflowsResponse = {
  message: string;
  workflows: Workflow[];
  totalCount: number;
};

export type GetWorkflowByIdResponse = {
  message: string;
  workflow: Workflow;
};

export type CreateWorkflowResponse = {
  message: string;
  workflow: Workflow;
};

export type UpdateWorkflowResponse = {
  message: string;
  workflow: Workflow;
};

export type DeleteWorkflowResponse = {
  message: string;
  id: string;
};

export type ToggleWorkflowResponse = {
  message: string;
  workflow: Workflow;
};
