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
exports.getLeadActivityByLeadId = exports.getAllOrganizations = exports.convertLeadToDeal = exports.bulkWriteLeads = exports.deleteLeadById = exports.updateLeadById = exports.createLead = exports.getLeadById = exports.getAllLeads = void 0;
const lead_service_1 = require("../services/lead.service");
const app_error_1 = require("../shared/app-error");
const api_response_1 = require("../shared/api-response");
const async_handler_1 = require("../shared/async-handler");
exports.getAllLeads = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.user;
    if (!tenantId) {
        throw new app_error_1.AppError("Tenant ID is missing in user data", 400);
    }
    const cursor = req.query.cursor;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search;
    const { leads, totalCount } = yield (0, lead_service_1.fetchLeadsService)({
        tenantId,
        cursor,
        limit,
        search,
    });
    (0, api_response_1.sendSuccess)(res, 200, "Leads retrieved successfully", {
        leads,
        totalCount,
    });
}));
exports.getLeadById = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.user;
    if (!tenantId) {
        throw new app_error_1.AppError("Tenant ID is missing in user data", 400);
    }
    const { id } = req.params;
    if (!id) {
        throw new app_error_1.AppError("Lead ID is required", 400);
    }
    const lead = yield (0, lead_service_1.fetchLeadByIdService)({ id, tenantId });
    if (!lead) {
        throw new app_error_1.AppError("Lead not found", 404);
    }
    (0, api_response_1.sendSuccess)(res, 200, "Lead retrieved successfully", { lead });
}));
exports.createLead = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.user;
    if (!tenantId) {
        throw new app_error_1.AppError("Tenant ID is missing in user data", 400);
    }
    const { idempotentId, orgId, orgName, firstName, lastName, email, mobile, gender, source, } = req.body;
    if (!idempotentId || !tenantId || !orgId || !orgName) {
        throw new app_error_1.AppError("Idempotent ID, Tenant ID, Organization ID, and Organization Name are required", 400);
    }
    const lead = yield (0, lead_service_1.createLeadService)({
        idempotentId,
        tenantId,
        orgId,
        orgName,
        userId: req.user._id,
        userName: req.user.firstName,
        firstName,
        lastName,
        email,
        mobile,
        gender,
        source,
    });
    if (!lead) {
        throw new app_error_1.AppError("Failed to create lead", 400);
    }
    (0, api_response_1.sendSuccess)(res, 201, "Lead created successfully", { lead });
}));
exports.updateLeadById = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.user;
    if (!tenantId) {
        throw new app_error_1.AppError("Tenant ID is missing in user data", 400);
    }
    const { id } = req.params;
    if (!id) {
        throw new app_error_1.AppError("Lead ID is required", 400);
    }
    const { orgId, orgName, firstName, lastName, email, mobile, gender, source, status, } = req.body;
    const updatedLead = yield (0, lead_service_1.updateLeadByIdService)({
        id,
        tenantId,
        orgId,
        orgName,
        userId: req.user._id,
        userName: req.user.firstName,
        firstName,
        lastName,
        email,
        mobile,
        gender,
        source,
        status,
    });
    if (!updatedLead) {
        throw new app_error_1.AppError("Lead not found or failed to update", 404);
    }
    (0, api_response_1.sendSuccess)(res, 200, "Lead updated successfully", { updatedLead });
}));
exports.deleteLeadById = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.user;
    if (!tenantId) {
        throw new app_error_1.AppError("Tenant ID is missing in user data", 400);
    }
    const { id } = req.params;
    if (!id) {
        throw new app_error_1.AppError("Lead ID is required", 400);
    }
    const deleted = yield (0, lead_service_1.deleteLeadByIdService)({
        id,
        tenantId,
        userId: req.user._id,
        userName: req.user.firstName,
    });
    if (!deleted) {
        throw new app_error_1.AppError("Lead not found", 404);
    }
    (0, api_response_1.sendSuccess)(res, 200, "Lead deleted successfully", { id });
}));
exports.bulkWriteLeads = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.user;
    if (!tenantId) {
        throw new app_error_1.AppError("Tenant ID is missing in user data", 400);
    }
    const { leads } = req.body;
    if (!Array.isArray(leads) || leads.length === 0) {
        throw new app_error_1.AppError("leads must be a non-empty array", 400);
    }
    const result = yield (0, lead_service_1.bulkWriteLeadsService)({ tenantId, leads });
    (0, api_response_1.sendSuccess)(res, 201, `${result.insertedCount} lead(s) created successfully`, { insertedCount: result.insertedCount });
}));
exports.convertLeadToDeal = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.user;
    if (!tenantId) {
        throw new app_error_1.AppError("Tenant ID is missing in user data", 400);
    }
    const { id } = req.params;
    if (!id) {
        throw new app_error_1.AppError("Lead ID is required", 400);
    }
    const { idempotentId, dealName, value, probability } = req.body;
    if (!idempotentId) {
        throw new app_error_1.AppError("Idempotent ID is required for deal creation", 400);
    }
    const { deal } = yield (0, lead_service_1.convertLeadToDealService)({
        id,
        tenantId,
        userId: req.user._id,
        userName: req.user.firstName,
        idempotentId,
        dealName,
        value,
        probability,
    });
    (0, api_response_1.sendSuccess)(res, 201, "Lead converted to deal successfully", { deal });
}));
exports.getAllOrganizations = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.user;
    if (!tenantId) {
        throw new app_error_1.AppError("Tenant ID is missing in user data", 400);
    }
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search;
    const { organizations } = yield (0, lead_service_1.fetchOrganizationsService)({
        tenantId,
        limit,
        search,
    });
    (0, api_response_1.sendSuccess)(res, 200, "Organizations retrieved successfully", {
        organizations,
    });
}));
exports.getLeadActivityByLeadId = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        throw new app_error_1.AppError("Lead ID is required", 400);
    }
    const activities = yield (0, lead_service_1.fetchLeadActivityByLeadIdService)({
        leadId: id,
    });
    (0, api_response_1.sendSuccess)(res, 200, "Lead activities retrieved successfully", {
        activities,
    });
}));
