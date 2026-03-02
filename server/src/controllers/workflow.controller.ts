import { Request, Response } from "express";
import { Types } from "mongoose";
import {
  fetchWorkflowsService,
  fetchWorkflowByIdService,
  createWorkflowService,
  updateWorkflowByIdService,
  deleteWorkflowByIdService,
  toggleWorkflowService,
} from "../services/workflow.service";
import { AppError } from "../shared/app-error";
import { sendSuccess } from "../shared/api-response";
import { asyncHandler } from "../shared/async-handler";

export const getAllWorkflows = asyncHandler(
  async (req: Request, res: Response) => {
    const { tenantId, _id: userId } = req.user;
    if (!tenantId) {
      throw new AppError("Tenant ID is missing in user data", 400);
    }

    const cursor = req.query.cursor as Types.ObjectId | undefined;
    const limit = Number(req.query.limit) || 20;
    const search = req.query.search as string | undefined;

    const { workflows, totalCount } = await fetchWorkflowsService({
      tenantId,
      userId,
      cursor,
      limit,
      search,
    });

    sendSuccess(res, 200, "Workflows retrieved successfully", {
      workflows,
      totalCount,
    });
  },
);

export const getWorkflowById = asyncHandler(
  async (req: Request, res: Response) => {
    const { tenantId, _id: userId } = req.user;
    if (!tenantId) {
      throw new AppError("Tenant ID is missing in user data", 400);
    }

    const id = req.params.id as unknown as Types.ObjectId;
    if (!id) {
      throw new AppError("Workflow ID is required", 400);
    }

    const workflow = await fetchWorkflowByIdService({ id, tenantId, userId });

    sendSuccess(res, 200, "Workflow retrieved successfully", { workflow });
  },
);

export const createWorkflow = asyncHandler(
  async (req: Request, res: Response) => {
    const { tenantId, _id: userId } = req.user;
    if (!tenantId) {
      throw new AppError("Tenant ID is missing in user data", 400);
    }

    const { name, description, active, entity, event, actions } = req.body;

    if (!name) {
      throw new AppError("Name is required", 400);
    }
    if (!entity) {
      throw new AppError("Entity is required", 400);
    }
    if (!event) {
      throw new AppError("Event is required", 400);
    }
    if (!actions || !Array.isArray(actions) || actions.length === 0) {
      throw new AppError(
        "Actions are required and must be a non-empty array",
        400,
      );
    }

    const workflow = await createWorkflowService({
      tenantId,
      userId,
      name,
      description,
      active,
      entity,
      event,
      actions: actions ?? [],
    });

    sendSuccess(res, 201, "Workflow created successfully", { workflow });
  },
);

export const updateWorkflowById = asyncHandler(
  async (req: Request, res: Response) => {
    const { tenantId, _id: userId } = req.user;
    if (!tenantId) {
      throw new AppError("Tenant ID is missing in user data", 400);
    }

    const id = req.params.id as unknown as Types.ObjectId;
    if (!id) {
      throw new AppError("Workflow ID is required", 400);
    }

    const { name, description, active, entity, event, actions } = req.body;

    const updatedWorkflow = await updateWorkflowByIdService({
      id,
      tenantId,
      userId,
      name,
      description,
      active,
      entity,
      event,
      actions,
    });

    sendSuccess(res, 200, "Workflow updated successfully", {
      workflow: updatedWorkflow,
    });
  },
);

export const deleteWorkflowById = asyncHandler(
  async (req: Request, res: Response) => {
    const { tenantId, _id: userId } = req.user;
    if (!tenantId) {
      throw new AppError("Tenant ID is missing in user data", 400);
    }

    const id = req.params.id as unknown as Types.ObjectId;
    if (!id) {
      throw new AppError("Workflow ID is required", 400);
    }

    await deleteWorkflowByIdService({ id, tenantId, userId });

    sendSuccess(res, 200, "Workflow deleted successfully", { id });
  },
);

export const toggleWorkflow = asyncHandler(
  async (req: Request, res: Response) => {
    const { tenantId, _id: userId } = req.user;
    if (!tenantId) {
      throw new AppError("Tenant ID is missing in user data", 400);
    }

    const id = req.params.id as unknown as Types.ObjectId;
    if (!id) {
      throw new AppError("Workflow ID is required", 400);
    }

    const workflow = await toggleWorkflowService({ id, tenantId, userId });

    sendSuccess(
      res,
      200,
      `Workflow ${workflow.active ? "enabled" : "disabled"} successfully`,
      { workflow },
    );
  },
);
