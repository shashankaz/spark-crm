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
exports.changePasswordService = exports.editProfileService = exports.getUserSessionsService = exports.getUserProfileService = exports.logoutService = exports.refreshAuthTokenService = exports.loginService = void 0;
const date_fns_1 = require("date-fns");
const mongoose_1 = require("mongoose");
const session_model_1 = require("../models/session.model");
const user_model_1 = require("../models/user.model");
const app_error_1 = require("../shared/app-error");
const bcrypt_1 = require("../utils/auth/bcrypt");
const jwt_1 = require("../utils/auth/jwt");
const loginService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, password, }) {
    const user = yield user_model_1.User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
        throw new app_error_1.AppError("Invalid email or password", 401);
    }
    const isMatch = yield (0, bcrypt_1.verifyPassword)(password, user.password);
    if (!isMatch) {
        throw new app_error_1.AppError("Invalid email or password", 401);
    }
    const session = yield session_model_1.Session.create({
        userId: user._id,
    });
    const accessToken = (0, jwt_1.generateAccessToken)(user._id.toString());
    const refreshToken = (0, jwt_1.generateRefreshToken)(session._id.toString());
    if (!accessToken || !refreshToken) {
        throw new app_error_1.AppError("Failed to generate tokens", 500);
    }
    const hashedRefreshToken = yield (0, bcrypt_1.hashRefreshToken)(refreshToken);
    yield session_model_1.Session.findByIdAndUpdate(session._id, {
        token: hashedRefreshToken,
    });
    const responseUser = {
        _id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        createdAt: (0, date_fns_1.format)(user.createdAt, "dd/MM/yyyy"),
        updatedAt: (0, date_fns_1.format)(user.updatedAt, "dd/MM/yyyy"),
    };
    return {
        accessToken,
        refreshToken,
        user: responseUser,
    };
});
exports.loginService = loginService;
const refreshAuthTokenService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ refreshToken, }) {
    const payload = (0, jwt_1.verifyRefreshToken)(refreshToken);
    if (!payload || !payload._id) {
        throw new app_error_1.AppError("Invalid refresh token", 401);
    }
    const session = yield session_model_1.Session.findById(payload._id);
    if (!session) {
        throw new app_error_1.AppError("Session not found", 401);
    }
    const isTokenValid = yield (0, bcrypt_1.verifyRefreshTokenHash)(refreshToken, session.token);
    if (!isTokenValid) {
        throw new app_error_1.AppError("Refresh token invalid or expired", 401);
    }
    const newAccessToken = (0, jwt_1.generateAccessToken)(session.userId.toString());
    const newRefreshToken = (0, jwt_1.generateRefreshToken)(session._id.toString());
    const hashedNewRefreshToken = yield (0, bcrypt_1.hashRefreshToken)(newRefreshToken);
    yield session_model_1.Session.findByIdAndUpdate(session._id, {
        token: hashedNewRefreshToken,
    });
    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    };
});
exports.refreshAuthTokenService = refreshAuthTokenService;
const logoutService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId, }) {
    return yield session_model_1.Session.deleteMany({
        userId: new mongoose_1.Types.ObjectId(userId),
    });
});
exports.logoutService = logoutService;
const getUserProfileService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ id, }) {
    const user = yield user_model_1.User.findById(id).select("-password");
    if (!user) {
        throw new app_error_1.AppError("User not found", 404);
    }
    return {
        _id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        createdAt: (0, date_fns_1.format)(user.createdAt, "dd/MM/yyyy"),
        updatedAt: (0, date_fns_1.format)(user.updatedAt, "dd/MM/yyyy"),
    };
});
exports.getUserProfileService = getUserProfileService;
const getUserSessionsService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ id }) {
    return yield session_model_1.Session.find({
        userId: new mongoose_1.Types.ObjectId(id),
    })
        .sort({ _id: -1 })
        .limit(10);
});
exports.getUserSessionsService = getUserSessionsService;
const editProfileService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ id, firstName, lastName, mobile, }) {
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new app_error_1.AppError("User not found", 404);
    }
    if (firstName)
        user.firstName = firstName;
    if (lastName)
        user.lastName = lastName;
    if (mobile)
        user.mobile = mobile;
    yield user.save();
    return {
        _id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        updatedAt: (0, date_fns_1.format)(user.updatedAt, "dd/MM/yyyy"),
    };
});
exports.editProfileService = editProfileService;
const changePasswordService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ id, currentPassword, newPassword, }) {
    const user = yield user_model_1.User.findById(id).select("+password");
    if (!user) {
        throw new app_error_1.AppError("User not found", 404);
    }
    const isMatch = yield (0, bcrypt_1.verifyPassword)(currentPassword, user.password);
    if (!isMatch) {
        throw new app_error_1.AppError("Current password is incorrect", 401);
    }
    user.password = yield (0, bcrypt_1.hashPassword)(newPassword);
    yield user.save();
});
exports.changePasswordService = changePasswordService;
