import bcrypt from "bcrypt";
import crypto from "crypto";
import { env } from "../../config/env";

const PEPPER = env.PEPPER;

const BCRYPT_ROUNDS = 10;
const BCRYPT_TOKEN_ROUNDS = 12;

export const hashPassword = async (password: string): Promise<string> => {
  if (typeof password !== "string") {
    throw new Error("Password must be a string");
  }

  if (password.length < 8 || password.length > 64) {
    throw new Error("Password must be between 8 and 64 characters");
  }

  const complexityRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).+$/;

  if (!complexityRegex.test(password)) {
    throw new Error(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    );
  }

  const normalized = password.normalize("NFKC");

  const preHash = crypto
    .createHash("sha256")
    .update(normalized, "utf8")
    .digest("hex");

  const withPepper = preHash + PEPPER;

  const salt = await bcrypt.genSalt(BCRYPT_ROUNDS);
  const hashed = await bcrypt.hash(withPepper, salt);

  return hashed;
};

export const verifyPassword = async (
  password: string,
  storedHash: string,
): Promise<boolean> => {
  if (typeof password !== "string") return false;

  const normalized = password.normalize("NFKC");

  const preHash = crypto
    .createHash("sha256")
    .update(normalized, "utf8")
    .digest("hex");

  const withPepper = preHash + PEPPER;

  return bcrypt.compare(withPepper, storedHash);
};

export const hashRefreshToken = async (token: string): Promise<string> => {
  if (typeof token !== "string") {
    throw new Error("Refresh token must be a string");
  }

  return await bcrypt.hash(token, BCRYPT_TOKEN_ROUNDS);
};

export const verifyRefreshTokenHash = async (
  token: string,
  storedHash: string,
): Promise<boolean> => {
  if (typeof token !== "string") return false;

  return bcrypt.compare(token, storedHash);
};
