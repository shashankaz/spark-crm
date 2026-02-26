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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshTokenHash = exports.hashRefreshToken = exports.verifyPassword = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const env_js_1 = require("../../config/env.js");
const PEPPER = env_js_1.env.PEPPER;
const BCRYPT_ROUNDS = 10;
const BCRYPT_TOKEN_ROUNDS = 12;
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof password !== "string") {
        throw new Error("Password must be a string");
    }
    if (password.length < 8 || password.length > 64) {
        throw new Error("Password must be between 8 and 64 characters");
    }
    const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).+$/;
    if (!complexityRegex.test(password)) {
        throw new Error("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character");
    }
    const normalized = password.normalize("NFKC");
    const preHash = crypto_1.default
        .createHash("sha256")
        .update(normalized, "utf8")
        .digest("hex");
    const withPepper = preHash + PEPPER;
    const salt = yield bcrypt_1.default.genSalt(BCRYPT_ROUNDS);
    const hashed = yield bcrypt_1.default.hash(withPepper, salt);
    return hashed;
});
exports.hashPassword = hashPassword;
const verifyPassword = (password, storedHash) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof password !== "string")
        return false;
    const normalized = password.normalize("NFKC");
    const preHash = crypto_1.default
        .createHash("sha256")
        .update(normalized, "utf8")
        .digest("hex");
    const withPepper = preHash + PEPPER;
    return bcrypt_1.default.compare(withPepper, storedHash);
});
exports.verifyPassword = verifyPassword;
const hashRefreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof token !== "string") {
        throw new Error("Refresh token must be a string");
    }
    return yield bcrypt_1.default.hash(token, BCRYPT_TOKEN_ROUNDS);
});
exports.hashRefreshToken = hashRefreshToken;
const verifyRefreshTokenHash = (token, storedHash) => __awaiter(void 0, void 0, void 0, function* () {
    if (typeof token !== "string")
        return false;
    return bcrypt_1.default.compare(token, storedHash);
});
exports.verifyRefreshTokenHash = verifyRefreshTokenHash;
