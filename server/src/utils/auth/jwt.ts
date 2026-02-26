import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../../config/env";

interface TokenPayload extends JwtPayload {
  _id: string;
}

export const verifyAccessToken = (token: string): TokenPayload | null => {
  const secret = env.ACCESS_SECRET;
  if (!secret) return null;

  try {
    const decoded = jwt.verify(token, secret) as TokenPayload;
    return decoded;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const generateAccessToken = (id: string): string | null => {
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

export const verifyRefreshToken = (token: string): TokenPayload | null => {
  const secret = env.REFRESH_SECRET;
  if (!secret) return null;

  try {
    const decoded = jwt.verify(token, secret) as TokenPayload;
    return decoded;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const generateRefreshToken = (id: string): string | null => {
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
