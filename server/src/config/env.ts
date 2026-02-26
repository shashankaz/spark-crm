import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),

  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),

  ACCESS_SECRET: z.string().min(1, "ACCESS_SECRET is required"),
  REFRESH_SECRET: z.string().min(1, "REFRESH_SECRET is required"),
  PEPPER: z.string().min(1, "PEPPER is required"),

  AWS_REGION: z.string().min(1, "AWS_REGION is required"),
  AWS_ACCESS_KEY_ID: z.string().min(1, "AWS_ACCESS_KEY_ID is required"),
  AWS_SECRET_ACCESS_KEY: z.string().min(1, "AWS_SECRET_ACCESS_KEY is required"),
  AWS_BUCKET_NAME: z.string().min(1, "AWS_BUCKET_NAME is required"),

  MAILTRAP_HOST: z.string().min(1, "MAILTRAP_HOST is required"),
  MAILTRAP_PORT: z.coerce.number().int().positive().default(2525),
  MAILTRAP_USER: z.string().min(1, "MAILTRAP_USER is required"),
  MAILTRAP_PASS: z.string().min(1, "MAILTRAP_PASS is required"),

  NODE_ENV: z.enum(["development", "production"]).default("development"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:");
  console.error(parsed.error);
  process.exit(1);
}

export const env = parsed.data;
export const isProduction = env.NODE_ENV === "production";
export const isDevelopment = env.NODE_ENV === "development";
