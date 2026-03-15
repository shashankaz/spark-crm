import type { IWorkflow } from "@/types/domain";

/**
 * API response types
 */

export type WorkflowsData = {
  workflows: IWorkflow[];
  totalCount: number;
};

export type WorkflowData = {
  workflow: IWorkflow;
};

export type DeletedWorkflowData = {
  id: string;
};

/**
 * Request types
 */

export type GetAllWorkflowsRequest = {
  cursor?: string;
  limit?: number;
  search?: string;
  entity?: string;
  event?: string;
  active?: boolean;
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

/**
 * Response types
 */

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
  workflows: IWorkflow[];
  totalCount: number;
};

export type GetWorkflowByIdResponse = {
  message: string;
  workflow: IWorkflow;
};

export type CreateWorkflowResponse = {
  message: string;
  workflow: IWorkflow;
};

export type UpdateWorkflowResponse = {
  message: string;
  workflow: IWorkflow;
};

export type DeleteWorkflowResponse = {
  message: string;
  id: string;
};

export type ToggleWorkflowResponse = {
  message: string;
  workflow: IWorkflow;
};
