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
exports.createCallForLead = exports.getAllCallsByLeadId = void 0;
const call_service_1 = require("../services/call.service");
const app_error_1 = require("../shared/app-error");
const api_response_1 = require("../shared/api-response");
const async_handler_1 = require("../shared/async-handler");
exports.getAllCallsByLeadId = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { leadId } = req.params;
    if (!leadId) {
        throw new app_error_1.AppError("Lead ID is required", 400);
    }
    const cursor = req.query.cursor;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search;
    const { calls, totalCount } = yield (0, call_service_1.fetchCallsByLeadService)({
        leadId,
        cursor,
        limit,
        search,
    });
    (0, api_response_1.sendSuccess)(res, 200, "Calls retrieved successfully", {
        calls,
        totalCount,
    });
}));
exports.createCallForLead = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { leadId } = req.params;
    if (!leadId) {
        throw new app_error_1.AppError("Lead ID is required", 400);
    }
    const { tenantId, _id: userId, firstName: userName } = req.user;
    if (!tenantId) {
        throw new app_error_1.AppError("Tenant ID is missing in user data", 400);
    }
    const { type, status, duration } = req.body;
    if (!type || !status) {
        throw new app_error_1.AppError("Type and status are required to create a call", 400);
    }
    const call = yield (0, call_service_1.createCallForLeadService)({
        tenantId,
        leadId,
        userId,
        userName,
        type,
        from: userName,
        status,
        duration,
    });
    if (!call) {
        throw new app_error_1.AppError("Failed to create call", 400);
    }
    (0, api_response_1.sendSuccess)(res, 201, "Call created successfully", { call });
}));
