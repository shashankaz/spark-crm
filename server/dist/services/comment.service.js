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
exports.createCommentForLeadService = exports.fetchCommentsByLeadService = void 0;
const comment_model_js_1 = require("../models/comment.model.js");
const lead_model_js_1 = require("../models/lead.model.js");
const app_error_js_1 = require("../shared/app-error.js");
const lead_action_history_service_js_1 = require("./lead-action-history.service.js");
const fetchCommentsByLeadService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ leadId, cursor, limit, search, }) {
    const countQuery = { leadId };
    if (search) {
        countQuery.comment = { $regex: search, $options: "i" };
    }
    const whereQuery = Object.assign({}, countQuery);
    if (cursor) {
        whereQuery._id = { $gt: cursor };
    }
    const [totalCount, comments] = yield Promise.all([
        comment_model_js_1.Comment.countDocuments(countQuery).exec(),
        comment_model_js_1.Comment.find(whereQuery).sort({ _id: -1 }).limit(limit).exec(),
    ]);
    return { comments, totalCount };
});
exports.fetchCommentsByLeadService = fetchCommentsByLeadService;
const createCommentForLeadService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ tenantId, leadId, userId, userName, comment, }) {
    const lead = yield lead_model_js_1.Lead.findById(leadId).exec();
    if (!lead) {
        throw new app_error_js_1.AppError("Lead not found", 404);
    }
    const newComment = yield comment_model_js_1.Comment.create({
        tenantId,
        leadId,
        comment,
    });
    yield (0, lead_action_history_service_js_1.createLeadActionHistoryService)({
        leadId,
        actionType: "lead_commented",
        message: `Comment added by ${userName}: "${comment}"`,
        userId,
        userName,
    });
    return newComment;
});
exports.createCommentForLeadService = createCommentForLeadService;
