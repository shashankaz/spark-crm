import { formatDate } from "date-fns";
import { Deal } from "../models/deal.model";
import {
  IFetchDealsInput,
  IDeleteDealInput,
  IGetDealInput,
  IUpdateDealInput,
} from "./deal.service.types";

export const fetchDealsService = async ({
  tenantId,
  cursor,
  limit,
  search,
  valueRange,
  probability,
}: IFetchDealsInput) => {
  const countQuery: any = { tenantId };

  if (search) {
    countQuery.$or = [{ name: { $regex: search, $options: "i" } }];
  }

  if (valueRange === "low") {
    countQuery.value = { $lt: 10000 };
  } else if (valueRange === "medium") {
    countQuery.value = { $gte: 10000, $lte: 100000 };
  } else if (valueRange === "high") {
    countQuery.value = { $gt: 100000 };
  }

  if (probability === "low") {
    countQuery.probability = { $lte: 30 };
  } else if (probability === "medium") {
    countQuery.probability = { $gt: 30, $lte: 60 };
  } else if (probability === "high") {
    countQuery.probability = { $gt: 60 };
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
}: IDeleteDealInput) => {
  return await Deal.deleteOne({ _id: id, tenantId }).exec();
};

export const getDealByIdService = async ({ id, tenantId }: IGetDealInput) => {
  return await Deal.findOne({ _id: id, tenantId }).exec();
};

export const updateDealByIdService = async ({
  id,
  tenantId,
  name,
  value,
  probability,
}: IUpdateDealInput) => {
  const updateData: any = {};

  if (name !== undefined) updateData.name = name;
  if (value !== undefined) updateData.value = value;
  if (probability !== undefined) updateData.probability = probability;

  return await Deal.findOneAndUpdate(
    { _id: id, tenantId },
    { $set: updateData },
  ).exec();
};
