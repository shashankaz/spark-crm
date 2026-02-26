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
exports.getDashboardStats = void 0;
const dashboard_service_1 = require("../services/dashboard.service");
const api_response_1 = require("../shared/api-response");
const async_handler_1 = require("../shared/async-handler");
exports.getDashboardStats = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tenantId = req.user.tenantId;
    const { stats, recentLeads, recentDeals } = yield (0, dashboard_service_1.fetchDashboardStatsService)({
        tenantId,
    });
    (0, api_response_1.sendSuccess)(res, 200, "Dashboard stats retrieved successfully", {
        stats,
        recentLeads,
        recentDeals,
    });
}));
