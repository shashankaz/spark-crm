"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDevelopment = exports.isProduction = exports.env = void 0;
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    PORT: zod_1.z.coerce.number().int().positive().default(3000),
    MONGODB_URI: zod_1.z.string().min(1, "MONGODB_URI is required"),
    ACCESS_SECRET: zod_1.z.string().min(1, "ACCESS_SECRET is required"),
    REFRESH_SECRET: zod_1.z.string().min(1, "REFRESH_SECRET is required"),
    PEPPER: zod_1.z.string().min(1, "PEPPER is required"),
    AWS_REGION: zod_1.z.string().min(1, "AWS_REGION is required"),
    AWS_ACCESS_KEY_ID: zod_1.z.string().min(1, "AWS_ACCESS_KEY_ID is required"),
    AWS_SECRET_ACCESS_KEY: zod_1.z.string().min(1, "AWS_SECRET_ACCESS_KEY is required"),
    AWS_BUCKET_NAME: zod_1.z.string().min(1, "AWS_BUCKET_NAME is required"),
    MAILTRAP_HOST: zod_1.z.string().min(1, "MAILTRAP_HOST is required"),
    MAILTRAP_PORT: zod_1.z.coerce.number().int().positive().default(2525),
    MAILTRAP_USER: zod_1.z.string().min(1, "MAILTRAP_USER is required"),
    MAILTRAP_PASS: zod_1.z.string().min(1, "MAILTRAP_PASS is required"),
    NODE_ENV: zod_1.z.enum(["development", "production"]).default("development"),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.error("Invalid environment variables:");
    console.error(parsed.error);
    process.exit(1);
}
exports.env = parsed.data;
exports.isProduction = exports.env.NODE_ENV === "production";
exports.isDevelopment = exports.env.NODE_ENV === "development";
