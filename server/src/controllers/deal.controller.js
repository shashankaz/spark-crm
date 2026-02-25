import {
  fetchDealsService,
  deleteDealByIdService,
} from "../services/deal.service.js";
import { AppError } from "../shared/app-error.js";
import { sendSuccess } from "../shared/api-response.js";

export const getAllDeals = async (req, res, next) => {
  try {
    const { tenantId } = req.user;
    if (!tenantId) {
      throw new AppError("Tenant ID is missing in user data", 400);
    }

    const cursor = req.query.cursor;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search;

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
  } catch (error) {
    next(error);
  }
};

export const deleteDealById = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};
