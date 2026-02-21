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
