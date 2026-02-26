import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";

export const verifyAccessToken = (token) => {
  const secret = env.ACCESS_SECRET;
  if (!secret) return null;

  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const generateAccessToken = (id) => {
  const secret = env.ACCESS_SECRET;
  if (!secret) return null;

  try {
    const token = jwt.sign({ _id: id }, secret, { expiresIn: "15m" });
    return token;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const verifyRefreshToken = (token) => {
  const secret = env.REFRESH_SECRET;
  if (!secret) return null;

  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const generateRefreshToken = (id) => {
  const secret = env.REFRESH_SECRET;
  if (!secret) return null;

  try {
    const token = jwt.sign({ _id: id }, secret, { expiresIn: "7d" });
    return token;
  } catch (error) {
    console.error(error);
    return null;
  }
};
