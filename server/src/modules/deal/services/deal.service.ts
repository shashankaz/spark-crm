import { formatDate } from "date-fns";
import { Deal } from "../models/deal.model";
import {
  FetchDealsInput,
  DeleteDealInput,
  GetDealInput,
  UpdateDealInput,
} from "./deal.service.types";

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

export const getDealByIdService = async ({ id, tenantId }: GetDealInput) => {
  return await Deal.findOne({ _id: id, tenantId }).exec();
};

export const updateDealByIdService = async ({
  id,
  tenantId,
  name,
  value,
  probability,
}: UpdateDealInput) => {
  const updateData: any = {};

  if (name !== undefined) updateData.name = name;
  if (value !== undefined) updateData.value = value;
  if (probability !== undefined) updateData.probability = probability;

  return await Deal.findOneAndUpdate(
    { _id: id, tenantId },
    { $set: updateData },
  ).exec();
};
