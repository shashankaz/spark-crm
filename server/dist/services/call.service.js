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
exports.createCallForLeadService = exports.fetchCallsByLeadService = void 0;
const mongoose_1 = require("mongoose");
const call_model_js_1 = require("../models/call.model.js");
const lead_model_js_1 = require("../models/lead.model.js");
const app_error_js_1 = require("../shared/app-error.js");
const lead_action_history_service_js_1 = require("./lead-action-history.service.js");
const fetchCallsByLeadService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ leadId, cursor, limit, search, }) {
    const countQuery = {
        leadId: new mongoose_1.Types.ObjectId(leadId),
    };
    if (search) {
        countQuery.status = { $regex: search, $options: "i" };
    }
    const whereQuery = Object.assign({}, countQuery);
    if (cursor) {
        whereQuery._id = { $lt: new mongoose_1.Types.ObjectId(cursor) };
    }
    const [totalCount, calls] = yield Promise.all([
        call_model_js_1.Call.countDocuments(countQuery).exec(),
        call_model_js_1.Call.find(whereQuery).sort({ _id: -1 }).limit(limit).exec(),
    ]);
    const formattedCalls = calls.map((call) => ({
        _id: call._id.toString(),
        tenantId: call.tenantId.toString(),
        leadId: call.leadId.toString(),
        type: call.type,
        to: call.to,
        from: call.from,
        status: call.status,
        duration: call.duration,
        createdAt: call.createdAt,
        updatedAt: call.updatedAt,
    }));
    return {
        calls: formattedCalls,
        totalCount,
    };
});
exports.fetchCallsByLeadService = fetchCallsByLeadService;
const createCallForLeadService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ tenantId, leadId, userId, userName, type, from, status, duration, }) {
    const lead = yield lead_model_js_1.Lead.findById(leadId).exec();
    if (!lead) {
        throw new app_error_js_1.AppError("Lead not found", 404);
    }
    const call = yield call_model_js_1.Call.create({
        tenantId: new mongoose_1.Types.ObjectId(tenantId),
        leadId: new mongoose_1.Types.ObjectId(leadId),
        type,
        to: lead.firstName,
        from,
        status,
        duration: duration !== null && duration !== void 0 ? duration : 0,
    });
    yield (0, lead_action_history_service_js_1.createLeadActionHistoryService)({
        leadId,
        actionType: "lead_call_logged",
        message: `Call logged by ${userName} — type: ${type}, status: ${status}, duration: ${duration !== null && duration !== void 0 ? duration : 0}s`,
        userId,
        userName,
    });
    return {
        _id: call._id.toString(),
        tenantId: call.tenantId.toString(),
        leadId: call.leadId.toString(),
        type: call.type,
        to: call.to,
        from: call.from,
        status: call.status,
        duration: call.duration,
        createdAt: call.createdAt,
        updatedAt: call.updatedAt,
    };
});
exports.createCallForLeadService = createCallForLeadService;
