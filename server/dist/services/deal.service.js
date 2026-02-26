"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDealByIdService = exports.fetchDealsService = void 0;
const date_fns_1 = require("date-fns");
const deal_model_js_1 = require("../models/deal.model.js");
const fetchDealsService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ tenantId, cursor, limit, search, }) {
    const countQuery = { tenantId };
    if (search) {
        countQuery.$or = [{ name: { $regex: search, $options: "i" } }];
    }
    const whereQuery = Object.assign({}, countQuery);
    if (cursor) {
        whereQuery._id = { $gt: cursor };
    }
    const [totalCount, deals] = yield Promise.all([
        deal_model_js_1.Deal.countDocuments(countQuery).exec(),
        deal_model_js_1.Deal.find(whereQuery).sort({ _id: -1 }).limit(limit).exec(),
    ]);
    const formattedDeals = deals.map((deal) => ({
        _id: deal._id,
        name: deal.name,
        value: deal.value || 0,
        probability: deal.probability || 0,
        updatedAt: (0, date_fns_1.formatDate)(deal.updatedAt, "dd/MM/yyyy"),
    }));
    return { deals: formattedDeals, totalCount };
});
exports.fetchDealsService = fetchDealsService;
const deleteDealByIdService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ id, tenantId, }) {
    return yield deal_model_js_1.Deal.deleteOne({ _id: id, tenantId }).exec();
});
exports.deleteDealByIdService = deleteDealByIdService;
