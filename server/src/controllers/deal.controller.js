import { fetchDealsService } from "../services/deal.service.js";

export const getAllDeals = async (req, res, next) => {
  try {
    const { tenantId } = req.user;
    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: "Tenant ID is missing in user data",
      });
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

    res.json({
      success: true,
      message: "Deals retrieved successfully",
      data: { deals, totalCount },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDealById = async (req, res, next) => {
  try {
    const { tenantId } = req.user;
    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: "Tenant ID is missing in user data",
      });
    }

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Deal ID is required",
      });
    }

    const deleted = await deleteDealByIdService({
      id,
      tenantId,
    });
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Deal not found",
      });
    }

    res.json({
      success: true,
      message: "Deal deleted successfully",
      data: { id },
    });
  } catch (error) {
    next(error);
  }
};
