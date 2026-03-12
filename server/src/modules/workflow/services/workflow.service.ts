import { Types } from "mongoose";
import { Workflow } from "../models/workflow.model";
import { AppError } from "../../../shared/app-error";
import {
  IFetchWorkflowsInput,
  IFetchWorkflowByIdInput,
  ICreateWorkflowInput,
  IUpdateWorkflowByIdInput,
  IDeleteWorkflowByIdInput,
  IToggleWorkflowInput,
} from "./workflow.service.types";

export const fetchWorkflowsService = async ({
  tenantId,
  userId,
  cursor,
  limit,
  search,
  entity,
  event,
  active,
}: IFetchWorkflowsInput) => {
  const countQuery: any = { tenantId, userId };

  if (search) {
    countQuery.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (entity) {
    countQuery.entity = entity;
  }

  if (event) {
    countQuery.event = event;
  }

  if (active !== undefined) {
    countQuery.active = active;
  }

  const whereQuery: any = { ...countQuery };
  if (cursor) {
    whereQuery._id = { $lt: cursor };
  }

  const [totalCount, workflows] = await Promise.all([
    Workflow.countDocuments(countQuery).exec(),
    Workflow.find(whereQuery).sort({ _id: -1 }).limit(limit).exec(),
  ]);

  return { workflows, totalCount };
};

export const fetchWorkflowByIdService = async ({
  id,
  tenantId,
  userId,
}: IFetchWorkflowByIdInput) => {
  const workflow = await Workflow.findOne({ _id: id, tenantId, userId }).exec();
  if (!workflow) {
    throw new AppError("Workflow not found", 404);
  }

  return workflow;
};

export const createWorkflowService = async ({
  tenantId,
  userId,
  name,
  description,
  active,
  entity,
  event,
  actions,
}: ICreateWorkflowInput) => {
  const workflow = new Workflow({
    tenantId,
    userId,
    name,
    description: description || undefined,
    active: active ?? true,
    entity,
    event,
    actions: actions ?? [],
  });

  return await workflow.save();
};

export const updateWorkflowByIdService = async ({
  id,
  tenantId,
  userId,
  name,
  description,
  active,
  entity,
  event,
  actions,
}: IUpdateWorkflowByIdInput) => {
  const workflow = await Workflow.findOne({ _id: id, tenantId, userId }).exec();
  if (!workflow) {
    throw new AppError("Workflow not found", 404);
  }

  if (name !== undefined) workflow.name = name;
  if (description !== undefined) workflow.description = description;
  if (active !== undefined) workflow.active = active;
  if (entity !== undefined) workflow.entity = entity;
  if (event !== undefined) workflow.event = event;
  if (actions !== undefined) workflow.actions = actions;

  return await workflow.save();
};

export const deleteWorkflowByIdService = async ({
  id,
  tenantId,
  userId,
}: IDeleteWorkflowByIdInput) => {
  const workflow = await Workflow.findOne({ _id: id, tenantId, userId }).exec();
  if (!workflow) {
    throw new AppError("Workflow not found", 404);
  }

  return await Workflow.deleteOne({ _id: id, tenantId, userId }).exec();
};

export const toggleWorkflowService = async ({
  id,
  tenantId,
  userId,
}: IToggleWorkflowInput) => {
  const workflow = await Workflow.findOne({ _id: id, tenantId, userId }).exec();
  if (!workflow) {
    throw new AppError("Workflow not found", 404);
  }

  workflow.active = !workflow.active;
  return await workflow.save();
};

export const triggerWorkflowsService = async ({
  tenantId,
  entity,
  event,
  payload,
}: {
  tenantId: Types.ObjectId;
  entity: string;
  event: string;
  payload: Record<string, unknown>;
}) => {
  const workflows = await Workflow.find({
    tenantId,
    entity,
    event,
    active: true,
  }).exec();

  for (const workflow of workflows) {
    for (const action of workflow.actions) {
      try {
        await executeWorkflowAction(action.type, action.config as any, payload);
      } catch (err) {
        console.error(
          `Workflow action ${action.type} failed for workflow ${workflow._id}:`,
          err,
        );
      }
    }

    await Workflow.updateOne(
      { _id: workflow._id },
      { $inc: { executionCount: 1 }, $set: { lastExecutedAt: new Date() } },
    ).exec();
  }

  return workflows.length;
};

async function executeWorkflowAction(
  type: string,
  config: Record<string, unknown>,
  payload: Record<string, unknown>,
): Promise<void> {
  switch (type) {
    case "send_email":
      console.log("[Workflow] send_email action", { config, payload });
      break;

    case "notify_user":
      console.log("[Workflow] notify_user action", { config, payload });
      break;

    case "send_webhook":
      console.log("[Workflow] send_webhook action", { config, payload });
      break;

    default:
      console.warn(`[Workflow] Unknown action type: ${type}`);
  }
}
