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
exports.changePassword = exports.editProfile = exports.getSessions = exports.getProfile = exports.logout = exports.refreshToken = exports.login = void 0;
const auth_service_1 = require("../services/auth.service");
const env_1 = require("../config/env");
const app_error_1 = require("../shared/app-error");
const api_response_1 = require("../shared/api-response");
const async_handler_1 = require("../shared/async-handler");
exports.login = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new app_error_1.AppError("Email and password are required", 400);
    }
    const { accessToken, refreshToken, user } = yield (0, auth_service_1.loginService)({
        email,
        password,
    });
    res.cookie("__auth_at", accessToken, {
        httpOnly: true,
        secure: env_1.isProduction,
        sameSite: env_1.isProduction ? "strict" : "lax",
        maxAge: 1000 * 60 * 15, // 15 minutes
    });
    res.cookie("__auth_rt", refreshToken, {
        httpOnly: true,
        secure: env_1.isProduction,
        sameSite: env_1.isProduction ? "strict" : "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });
    (0, api_response_1.sendSuccess)(res, 200, "Login successful", { user });
}));
exports.refreshToken = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rt = req.cookies["__auth_rt"];
    if (!rt) {
        throw new app_error_1.AppError("Refresh token is missing", 401);
    }
    const { accessToken, refreshToken } = yield (0, auth_service_1.refreshAuthTokenService)({
        refreshToken: rt,
    });
    res.cookie("__auth_at", accessToken, {
        httpOnly: true,
        secure: env_1.isProduction,
        sameSite: env_1.isProduction ? "strict" : "lax",
        maxAge: 1000 * 60 * 15,
    });
    res.cookie("__auth_rt", refreshToken, {
        httpOnly: true,
        secure: env_1.isProduction,
        sameSite: env_1.isProduction ? "strict" : "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    (0, api_response_1.sendSuccess)(res, 200, "Token refreshed successfully", {});
}));
exports.logout = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, auth_service_1.logoutService)({ userId: req.user._id });
    res.clearCookie("__auth_at");
    res.clearCookie("__auth_rt");
    (0, api_response_1.sendSuccess)(res, 200, "Logout successful", {});
}));
exports.getProfile = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, auth_service_1.getUserProfileService)({ id: req.user._id });
    (0, api_response_1.sendSuccess)(res, 200, "Profile retrieved successfully", { user });
}));
exports.getSessions = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sessions = yield (0, auth_service_1.getUserSessionsService)({ id: req.user._id });
    (0, api_response_1.sendSuccess)(res, 200, "Sessions retrieved successfully", { sessions });
}));
exports.editProfile = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, mobile } = req.body;
    if (!firstName && !lastName && !mobile) {
        throw new app_error_1.AppError("At least one field (firstName, lastName, or mobile) is required", 400);
    }
    const updatedUser = yield (0, auth_service_1.editProfileService)({
        id: req.user._id,
        firstName,
        lastName,
        mobile,
    });
    (0, api_response_1.sendSuccess)(res, 200, "Profile updated successfully", {
        user: updatedUser,
    });
}));
exports.changePassword = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
        throw new app_error_1.AppError("Current password and new password are required", 400);
    }
    if (currentPassword === newPassword) {
        throw new app_error_1.AppError("New password must be different from current password", 400);
    }
    yield (0, auth_service_1.changePasswordService)({
        id: req.user._id,
        currentPassword,
        newPassword,
    });
    (0, api_response_1.sendSuccess)(res, 200, "Password changed successfully", {});
}));
