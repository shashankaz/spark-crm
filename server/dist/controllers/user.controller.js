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
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getAllUsers = void 0;
const user_service_1 = require("../services/user.service");
const app_error_1 = require("../shared/app-error");
const api_response_1 = require("../shared/api-response");
const async_handler_1 = require("../shared/async-handler");
exports.getAllUsers = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.user;
    if (!tenantId) {
        throw new app_error_1.AppError("Tenant ID is missing in user data", 400);
    }
    const cursor = req.query.cursor;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search;
    const { users, totalCount } = yield (0, user_service_1.fetchUsersService)({
        tenantId,
        cursor,
        limit,
        search,
    });
    (0, api_response_1.sendSuccess)(res, 200, "Users retrieved successfully", {
        users,
        totalCount,
    });
}));
exports.getUserById = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.user;
    if (!tenantId) {
        throw new app_error_1.AppError("Tenant ID is missing in user data", 400);
    }
    const { id } = req.params;
    if (!id) {
        throw new app_error_1.AppError("User ID is required", 400);
    }
    const user = yield (0, user_service_1.fetchUserByIdService)({ tenantId, id });
    if (!user) {
        throw new app_error_1.AppError("User not found", 404);
    }
    (0, api_response_1.sendSuccess)(res, 200, "User retrieved successfully", { user });
}));
exports.createUser = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.user;
    if (!tenantId) {
        throw new app_error_1.AppError("Tenant ID is missing in user data", 400);
    }
    const { firstName, lastName, email, mobile, password, role } = req.body;
    if (!firstName || !email || !password) {
        throw new app_error_1.AppError("First name, email, and password are required", 400);
    }
    const createdUser = yield (0, user_service_1.createUserService)({
        tenantId,
        firstName,
        lastName,
        email,
        mobile,
        password,
        role,
    });
    if (!createdUser) {
        throw new app_error_1.AppError("Failed to create user", 400);
    }
    (0, api_response_1.sendSuccess)(res, 201, "User created successfully", { createdUser });
}));
exports.updateUser = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.user;
    if (!tenantId) {
        throw new app_error_1.AppError("Tenant ID is missing in user data", 400);
    }
    const { id } = req.params;
    if (!id) {
        throw new app_error_1.AppError("User ID is required", 400);
    }
    const { firstName, lastName, email, mobile, password, role } = req.body;
    if (!firstName && !email && !mobile && !password && !role) {
        throw new app_error_1.AppError("At least one field (first name, email, mobile, password, or role) is required to update", 400);
    }
    const updatedUser = yield (0, user_service_1.updateUserService)({
        tenantId,
        id,
        firstName,
        lastName,
        email,
        mobile,
        password,
        role,
    });
    if (!updatedUser) {
        throw new app_error_1.AppError("User not found", 404);
    }
    (0, api_response_1.sendSuccess)(res, 200, "User updated successfully", { updatedUser });
}));
exports.deleteUser = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tenantId } = req.user;
    if (!tenantId) {
        throw new app_error_1.AppError("Tenant ID is missing in user data", 400);
    }
    const { id } = req.params;
    if (!id) {
        throw new app_error_1.AppError("User ID is required", 400);
    }
    const deletedUser = yield (0, user_service_1.removeUserService)({ tenantId, id });
    if (!deletedUser) {
        throw new app_error_1.AppError("User not found", 404);
    }
    (0, api_response_1.sendSuccess)(res, 200, "User deleted successfully", { id });
}));
