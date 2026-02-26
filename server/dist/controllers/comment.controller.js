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
exports.createCommentForLead = exports.getAllCommentsByLeadId = void 0;
const comment_service_1 = require("../services/comment.service");
const app_error_1 = require("../shared/app-error");
const api_response_1 = require("../shared/api-response");
const async_handler_1 = require("../shared/async-handler");
exports.getAllCommentsByLeadId = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { leadId } = req.params;
    if (!leadId) {
        throw new app_error_1.AppError("Lead ID is required", 400);
    }
    const cursor = req.query.cursor;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search;
    const { comments, totalCount } = yield (0, comment_service_1.fetchCommentsByLeadService)({
        leadId,
        cursor,
        limit,
        search,
    });
    (0, api_response_1.sendSuccess)(res, 200, "Comments retrieved successfully", {
        comments,
        totalCount,
    });
}));
exports.createCommentForLead = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { leadId } = req.params;
    if (!leadId) {
        throw new app_error_1.AppError("Lead ID is required", 400);
    }
    const { tenantId, _id: userId, firstName: userName } = req.user;
    if (!tenantId) {
        throw new app_error_1.AppError("Tenant ID is missing in user data", 400);
    }
    const { comment } = req.body;
    if (!comment) {
        throw new app_error_1.AppError("Comment is required", 400);
    }
    const newComment = yield (0, comment_service_1.createCommentForLeadService)({
        tenantId,
        leadId,
        userId,
        userName,
        comment,
    });
    if (!newComment) {
        throw new app_error_1.AppError("Failed to create comment", 400);
    }
    (0, api_response_1.sendSuccess)(res, 201, "Comment created successfully", {
        comment: newComment,
    });
}));
