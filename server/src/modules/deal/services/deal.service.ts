import { formatDate } from "date-fns";
import { Deal } from "../models/deal.model";
import { Lead } from "../../lead/models/lead.model";
import {
  IFetchDealsInput,
  IDeleteDealInput,
  IGetDealInput,
  IUpdateDealInput,
} from "./deal.service.types";

const DEAL_SORT_FIELDS: Record<string, string> = {
  name: "name",
  value: "value",
  probability: "probability",
  updatedAt: "updatedAt",
  _id: "_id",
};

export const fetchDealsService = async ({
  tenantId,
  cursor,
  limit,
  search,
  valueRange,
  probability,
  sortBy = "_id",
  sortOrder = "desc",
}: IFetchDealsInput) => {
  const resolvedSortField = DEAL_SORT_FIELDS[sortBy] ?? "_id";
  const resolvedSortDir = sortOrder === "asc" ? 1 : -1;
  const sortStage: Record<string, 1 | -1> = {
    [resolvedSortField]: resolvedSortDir,
  };

  const whereQuery: any = { tenantId };

  if (search) {
    whereQuery.$or = [{ name: { $regex: search, $options: "i" } }];
  }

  if (valueRange === "low") {
    whereQuery.value = { $lt: 10000 };
  } else if (valueRange === "medium") {
    whereQuery.value = { $gte: 10000, $lte: 100000 };
  } else if (valueRange === "high") {
    whereQuery.value = { $gt: 100000 };
  }

  if (probability === "low") {
    whereQuery.probability = { $lte: 30 };
  } else if (probability === "medium") {
    whereQuery.probability = { $gt: 30, $lte: 60 };
  } else if (probability === "high") {
    whereQuery.probability = { $gt: 60 };
  }

  if (cursor) {
    whereQuery._id = { $gt: cursor };
  }

  const [totalCount, deals] = await Promise.all([
    Deal.countDocuments(whereQuery).exec(),
    Deal.find(whereQuery).sort(sortStage).limit(limit).exec(),
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
  const deal = await Deal.findOne({ _id: id, tenantId }).exec();
  if (!deal) {
    throw new Error("Deal not found");
  }

  const deleteResult = await Deal.deleteOne({ _id: id, tenantId }).exec();
  await Lead.updateOne(
    { _id: deal.leadId, tenantId, dealId: id },
    { $unset: { dealId: 1 }, $set: { status: "lost" } },
  ).exec();

  return deleteResult;
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
