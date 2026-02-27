import { formatDate } from "date-fns";
import { Deal } from "../models/deal.model";
import {
  FetchDealsInput,
  DeleteDealInput,
} from "../types/services/deal.service.types";

export const fetchDealsService = async ({
  tenantId,
  cursor,
  limit,
  search,
}: FetchDealsInput) => {
  const countQuery: any = { tenantId };
  if (search) {
    countQuery.$or = [{ name: { $regex: search, $options: "i" } }];
  }

  const whereQuery = { ...countQuery };
  if (cursor) {
    whereQuery._id = { $gt: cursor };
  }

  const [totalCount, deals] = await Promise.all([
    Deal.countDocuments(countQuery).exec(),
    Deal.find(whereQuery).sort({ _id: -1 }).limit(limit).exec(),
  ]);

  const formattedDeals = deals.map((deal) => ({
    _id: deal._id,
    name: deal.name,
    value: deal.value || 0,
    probability: deal.probability || 0,
    updatedAt: formatDate(deal.updatedAt, "dd/MM/yyyy"),
  }));

  return { deals: formattedDeals, totalCount };
};

export const deleteDealByIdService = async ({
  id,
  tenantId,
}: DeleteDealInput) => {
  return await Deal.deleteOne({ _id: id, tenantId }).exec();
};
