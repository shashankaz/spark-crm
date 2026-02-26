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
exports.deleteOrganizationById = exports.updateOrganizationById = exports.createOrganization = exports.getOrganizationById = exports.getAllOrganizations = void 0;
const organization_service_1 = require("../services/organization.service");
const app_error_1 = require("../shared/app-error");
const api_response_1 = require("../shared/api-response");
const async_handler_1 = require("../shared/async-handler");
exports.getAllOrganizations = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.user;
    if (!tenantId) {
        throw new app_error_1.AppError("Tenant ID is missing in user data", 400);
    }
    const cursor = req.query.cursor;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search;
    const { organizations, totalCount } = yield (0, organization_service_1.fetchOrganizationsService)({
        tenantId,
        cursor,
        limit,
        search,
    });
    (0, api_response_1.sendSuccess)(res, 200, "Organizations retrieved successfully", {
        organizations,
        totalCount,
    });
}));
exports.getOrganizationById = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.user;
    if (!tenantId) {
        throw new app_error_1.AppError("Tenant ID is missing in user data", 400);
    }
    const { id } = req.params;
    if (!id) {
        throw new app_error_1.AppError("Organization ID is required", 400);
    }
    const organization = yield (0, organization_service_1.fetchOrganizationByIdService)({ id, tenantId });
    if (!organization) {
        throw new app_error_1.AppError("Organization not found", 404);
    }
    (0, api_response_1.sendSuccess)(res, 200, "Organization retrieved successfully", {
        organization,
    });
}));
exports.createOrganization = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.user;
    if (!tenantId) {
        throw new app_error_1.AppError("Tenant ID is missing in user data", 400);
    }
    const { idempotentId, name, industry, size, country, email, mobile, website, contactName, contactEmail, contactMobile, } = req.body;
    if (!idempotentId || !name || !industry || !size || !country) {
        throw new app_error_1.AppError("Idempotent ID, Organization Name, Industry, Size, and Country are required", 400);
    }
    const organization = yield (0, organization_service_1.createOrganizationService)({
        idempotentId,
        tenantId,
        userId: req.user._id,
        name,
        industry,
        size,
        country,
        email,
        mobile,
        website,
        contactName,
        contactEmail,
        contactMobile,
    });
    if (!organization) {
        throw new app_error_1.AppError("Failed to create organization", 400);
    }
    (0, api_response_1.sendSuccess)(res, 201, "Organization created successfully", {
        organization,
    });
}));
exports.updateOrganizationById = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.user;
    if (!tenantId) {
        throw new app_error_1.AppError("Tenant ID is missing in user data", 400);
    }
    const { id } = req.params;
    if (!id) {
        throw new app_error_1.AppError("Organization ID is required", 400);
    }
    const { name, industry, size, country, email, mobile, website, contactName, contactEmail, contactMobile, } = req.body;
    const updatedOrganization = yield (0, organization_service_1.updateOrganizationByIdService)({
        id,
        tenantId,
        userId: req.user._id,
        name,
        industry,
        size,
        country,
        email,
        mobile,
        website,
        contactName,
        contactEmail,
        contactMobile,
    });
    if (!updatedOrganization) {
        throw new app_error_1.AppError("Organization not found or failed to update", 404);
    }
    (0, api_response_1.sendSuccess)(res, 200, "Organization updated successfully", {
        updatedOrganization,
    });
}));
exports.deleteOrganizationById = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.user;
    if (!tenantId) {
        throw new app_error_1.AppError("Tenant ID is missing in user data", 400);
    }
    const { id } = req.params;
    if (!id) {
        throw new app_error_1.AppError("Organization ID is required", 400);
    }
    const deleted = yield (0, organization_service_1.deleteOrganizationByIdService)({ id, tenantId });
    if (!deleted) {
        throw new app_error_1.AppError("Organization not found", 404);
    }
    (0, api_response_1.sendSuccess)(res, 200, "Organization deleted successfully", { id });
}));
