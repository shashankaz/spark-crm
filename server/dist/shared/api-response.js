"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendSuccess = void 0;
const sendSuccess = (res, statusCode, message, data) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};
exports.sendSuccess = sendSuccess;
const sendError = (res, statusCode, message, error = null) => {
    return res.status(statusCode).json({
        success: false,
        message,
        error,
    });
};
exports.sendError = sendError;
