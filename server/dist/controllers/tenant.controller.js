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
exports.createUserForTenant = exports.deleteTenantById = exports.updateTenantById = exports.createTenant = exports.getUsersByTenantId = exports.getTenantById = exports.getAllTenants = exports.getTenantDashboardStats = void 0;
const tenant_service_1 = require("../services/tenant.service");
const app_error_1 = require("../shared/app-error");
const api_response_1 = require("../shared/api-response");
const async_handler_1 = require("../shared/async-handler");
exports.getTenantDashboardStats = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { stats, recentTenants, planDistribution } = yield (0, tenant_service_1.fetchTenantDashboardStatsService)();
    (0, api_response_1.sendSuccess)(res, 200, "Tenant dashboard stats retrieved successfully", {
        stats,
        recentTenants,
        planDistribution,
    });
}));
exports.getAllTenants = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cursor = req.query.cursor;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search;
    const { tenants, totalCount } = yield (0, tenant_service_1.fetchTenantsService)({
        cursor,
        limit,
        search,
    });
    (0, api_response_1.sendSuccess)(res, 200, "Tenants retrieved successfully", {
        tenants,
        totalCount,
    });
}));
exports.getTenantById = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        throw new app_error_1.AppError("Tenant ID is required", 400);
    }
    const { tenant, usersCount } = yield (0, tenant_service_1.fetchTenantByIdService)({ id });
    (0, api_response_1.sendSuccess)(res, 200, "Tenant retrieved successfully", {
        tenant,
        usersCount,
    });
}));
exports.getUsersByTenantId = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        throw new app_error_1.AppError("Tenant ID is required", 400);
    }
    const search = req.query.search;
    const { users } = yield (0, tenant_service_1.fetchUsersByTenantIdService)({
        tenantId: id,
        search,
    });
    (0, api_response_1.sendSuccess)(res, 200, "Tenant users retrieved successfully", { users });
}));
exports.createTenant = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, gstNumber, panNumber, email, mobile, address, plan } = req.body;
    if (!name || !email || !mobile || !plan) {
        throw new app_error_1.AppError("Name, Email, Mobile, and Plan are required", 400);
    }
    const tenant = yield (0, tenant_service_1.createTenantService)({
        name,
        gstNumber,
        panNumber,
        email,
        mobile,
        address,
        plan,
    });
    if (!tenant) {
        throw new app_error_1.AppError("Failed to create tenant", 400);
    }
    (0, api_response_1.sendSuccess)(res, 201, "Tenant created successfully", { tenant });
}));
exports.updateTenantById = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        throw new app_error_1.AppError("Tenant ID is required", 400);
    }
    const { name, gstNumber, panNumber, email, mobile, address, plan } = req.body;
    if (!name && !email && !mobile) {
        throw new app_error_1.AppError("At least one field (name, email, mobile) is required to update", 400);
    }
    const updatedTenant = yield (0, tenant_service_1.updateTenantByIdService)({
        id,
        name,
        gstNumber,
        panNumber,
        email,
        mobile,
        address,
        plan,
    });
    if (!updatedTenant) {
        throw new app_error_1.AppError("Tenant not found", 404);
    }
    (0, api_response_1.sendSuccess)(res, 200, "Tenant updated successfully", { updatedTenant });
}));
exports.deleteTenantById = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        throw new app_error_1.AppError("Tenant ID is required", 400);
    }
    const deleted = yield (0, tenant_service_1.deleteTenantByIdService)({ id });
    if (!deleted) {
        throw new app_error_1.AppError("Tenant not found", 404);
    }
    (0, api_response_1.sendSuccess)(res, 200, "Tenant deleted successfully", { id });
}));
exports.createUserForTenant = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        throw new app_error_1.AppError("Tenant ID is required", 400);
    }
    const { name, email, mobile, password, role } = req.body;
    if (!name || !email || !password || !role) {
        throw new app_error_1.AppError("Name, Email, Password, and Role are required", 400);
    }
    const user = yield (0, tenant_service_1.createUserForTenantService)({
        tenantId: id,
        name,
        email,
        mobile,
        password,
        role,
    });
    if (!user) {
        throw new app_error_1.AppError("Failed to create user for tenant", 400);
    }
    (0, api_response_1.sendSuccess)(res, 200, "Tenant user created successfully", { user });
}));
