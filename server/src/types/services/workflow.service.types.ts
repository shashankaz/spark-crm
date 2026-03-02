import { Types } from "mongoose";
import {
  WorkflowAction,
  WorkflowEntity,
  WorkflowEvent,
} from "../models/workflow.model.types";

export interface FetchWorkflowsInput {
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
  cursor?: Types.ObjectId;
  limit: number;
  search?: string;
}

export interface FetchWorkflowByIdInput {
  id: string;
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
}

export interface CreateWorkflowInput {
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  description?: string;
  active?: boolean;
  entity: WorkflowEntity;
  event: WorkflowEvent;
  actions: WorkflowAction[];
}

export interface UpdateWorkflowByIdInput {
  id: string;
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
  name?: string;
  description?: string;
  active?: boolean;
  entity?: WorkflowEntity;
  event?: WorkflowEvent;
  actions?: WorkflowAction[];
}

export interface DeleteWorkflowByIdInput {
  id: string;
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
}

export interface ToggleWorkflowInput {
  id: string;
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
}
