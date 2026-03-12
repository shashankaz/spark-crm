import { Types } from "mongoose";
import {
  IWorkflowAction,
  WorkflowEntity,
  WorkflowEvent,
} from "../models/workflow.model.types";

export interface IFetchWorkflowsInput {
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
  cursor?: Types.ObjectId;
  limit: number;
  search?: string;
  entity?: string;
  event?: string;
  active?: boolean;
}

export interface IFetchWorkflowByIdInput {
  id: Types.ObjectId;
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
}

export interface ICreateWorkflowInput {
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  description?: string;
  active?: boolean;
  entity: WorkflowEntity;
  event: WorkflowEvent;
  actions: IWorkflowAction[];
}

export interface IUpdateWorkflowByIdInput {
  id: Types.ObjectId;
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
  name?: string;
  description?: string;
  active?: boolean;
  entity?: WorkflowEntity;
  event?: WorkflowEvent;
  actions?: IWorkflowAction[];
}

export interface IDeleteWorkflowByIdInput {
  id: Types.ObjectId;
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
}

export interface IToggleWorkflowInput {
  id: Types.ObjectId;
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
}
