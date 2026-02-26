"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.verifyRefreshToken = exports.generateAccessToken = exports.verifyAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_js_1 = require("../../config/env.js");
const verifyAccessToken = (token) => {
    const secret = env_js_1.env.ACCESS_SECRET;
    if (!secret)
        return null;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        return decoded;
    }
    catch (error) {
        console.error(error);
        return null;
    }
};
exports.verifyAccessToken = verifyAccessToken;
const generateAccessToken = (id) => {
    const secret = env_js_1.env.ACCESS_SECRET;
    if (!secret)
        return null;
    try {
        const token = jsonwebtoken_1.default.sign({ _id: id }, secret, { expiresIn: "15m" });
        return token;
    }
    catch (error) {
        console.error(error);
        return null;
    }
};
exports.generateAccessToken = generateAccessToken;
const verifyRefreshToken = (token) => {
    const secret = env_js_1.env.REFRESH_SECRET;
    if (!secret)
        return null;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        return decoded;
    }
    catch (error) {
        console.error(error);
        return null;
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
const generateRefreshToken = (id) => {
    const secret = env_js_1.env.REFRESH_SECRET;
    if (!secret)
        return null;
    try {
        const token = jsonwebtoken_1.default.sign({ _id: id }, secret, { expiresIn: "7d" });
        return token;
    }
    catch (error) {
        console.error(error);
        return null;
    }
};
exports.generateRefreshToken = generateRefreshToken;
