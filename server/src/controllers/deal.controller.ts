import { Request, Response } from "express";
import { Types } from "mongoose";
import {
  fetchDealsService,
  deleteDealByIdService,
  getDealByIdService,
  updateDealByIdService,
} from "../services/deal.service";
import { AppError } from "../shared/app-error";
import { sendSuccess } from "../shared/api-response";
import { asyncHandler } from "../shared/async-handler";

export const getAllDeals = asyncHandler(async (req: Request, res: Response) => {
  const { tenantId } = req.user;
  if (!tenantId) {
    throw new AppError("Tenant ID is missing in user data", 400);
  }

  const cursor = req.query.cursor as Types.ObjectId | undefined;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search as string | undefined;

  const { deals, totalCount } = await fetchDealsService({
    tenantId,
    cursor,
    limit,
    search,
  });

  sendSuccess(res, 200, "Deals retrieved successfully", {
    deals,
    totalCount,
  });
});

export const deleteDealById = asyncHandler(
  async (req: Request, res: Response) => {
    const { tenantId } = req.user;
    if (!tenantId) {
      throw new AppError("Tenant ID is missing in user data", 400);
    }

    const { id } = req.params;
    if (!id) {
      throw new AppError("Deal ID is required", 400);
    }

    const deleted = await deleteDealByIdService({
      id,
      tenantId,
    });
    if (!deleted) {
      throw new AppError("Deal not found", 404);
    }

    sendSuccess(res, 200, "Deal deleted successfully", { id });
  },
);

export const getDealById = asyncHandler(async (req: Request, res: Response) => {
  const { tenantId } = req.user;
  if (!tenantId) {
    throw new AppError("Tenant ID is missing in user data", 400);
  }

  const { id } = req.params;
  if (!id) {
    throw new AppError("Deal ID is required", 400);
  }

  const deal = await getDealByIdService({
    id,
    tenantId,
  });
  if (!deal) {
    throw new AppError("Deal not found", 404);
  }

  sendSuccess(res, 200, "Deal retrieved successfully", { deal });
});

export const updateDealById = asyncHandler(
  async (req: Request, res: Response) => {
    const { tenantId } = req.user;
    if (!tenantId) {
      throw new AppError("Tenant ID is missing in user data", 400);
    }

    const { id } = req.params;
    if (!id) {
      throw new AppError("Deal ID is required", 400);
    }

    const { name, value, probability } = req.body;

    const updatedDeal = await updateDealByIdService({
      id,
      tenantId,
      name,
      value,
      probability,
    });
    if (!updatedDeal) {
      throw new AppError("Deal not found", 404);
    }

    sendSuccess(res, 200, "Deal updated successfully", { deal: updatedDeal });
  },
);
