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
exports.createLeadActionHistoryService = void 0;
const lead_action_history_model_js_1 = require("../models/lead-action-history.model.js");
const lead_action_type_js_1 = require("../utils/lead-action-type.js");
const createLeadActionHistoryService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ leadId, actionType, message, userId, userName, }) {
    if (!lead_action_type_js_1.actionTypes.includes(actionType)) {
        throw new Error(`Invalid action type: ${actionType}`);
    }
    return yield lead_action_history_model_js_1.LeadActionHistory.create({
        leadId,
        actionType,
        message,
        userId,
        userName,
    });
});
exports.createLeadActionHistoryService = createLeadActionHistoryService;
