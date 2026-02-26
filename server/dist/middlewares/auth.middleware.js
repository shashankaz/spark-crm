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
exports.requireAuth = void 0;
const user_model_js_1 = require("../models/user.model.js");
const jwt_js_1 = require("../utils/auth/jwt.js");
const requireAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = req.cookies["__auth_at"];
        if (!accessToken) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        const decoded = (0, jwt_js_1.verifyAccessToken)(accessToken);
        if (!decoded || !decoded._id) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        const userData = yield user_model_js_1.User.findOne({ _id: decoded._id });
        if (!userData) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        req.user = Object.freeze(userData.toJSON());
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.requireAuth = requireAuth;
