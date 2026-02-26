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
exports.deleteDealById = exports.getAllDeals = void 0;
const deal_service_1 = require("../services/deal.service");
const app_error_1 = require("../shared/app-error");
const api_response_1 = require("../shared/api-response");
const async_handler_1 = require("../shared/async-handler");
exports.getAllDeals = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.user;
    if (!tenantId) {
        throw new app_error_1.AppError("Tenant ID is missing in user data", 400);
    }
    const cursor = req.query.cursor;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search;
    const { deals, totalCount } = yield (0, deal_service_1.fetchDealsService)({
        tenantId,
        cursor,
        limit,
        search,
    });
    (0, api_response_1.sendSuccess)(res, 200, "Deals retrieved successfully", {
        deals,
        totalCount,
    });
}));
exports.deleteDealById = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.user;
    if (!tenantId) {
        throw new app_error_1.AppError("Tenant ID is missing in user data", 400);
    }
    const { id } = req.params;
    if (!id) {
        throw new app_error_1.AppError("Deal ID is required", 400);
    }
    const deleted = yield (0, deal_service_1.deleteDealByIdService)({
        id,
        tenantId,
    });
    if (!deleted) {
        throw new app_error_1.AppError("Deal not found", 404);
    }
    (0, api_response_1.sendSuccess)(res, 200, "Deal deleted successfully", { id });
}));
