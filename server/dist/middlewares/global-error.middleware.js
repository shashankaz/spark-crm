"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const app_error_js_1 = require("../shared/app-error.js");
const globalErrorHandler = (err, req, res, next) => {
    var _a;
    console.error(err);
    if (err instanceof app_error_js_1.AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            error: {
                details: (_a = err.details) !== null && _a !== void 0 ? _a : null,
            },
        });
    }
    return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: {
            details: null,
        },
    });
};
exports.globalErrorHandler = globalErrorHandler;
