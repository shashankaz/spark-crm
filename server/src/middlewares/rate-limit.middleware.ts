import { Request, Response, NextFunction } from "express";
import arcjet, { tokenBucket } from "@arcjet/node";
import { env } from "../config/env";
import { AppError } from "../shared/app-error";

export const rateLimiter = ({
  capacity = 10,
  refillRate = 5,
  interval = 10,
}: {
  capacity?: number;
  refillRate?: number;
  interval?: number;
} = {}) => {
  const aj = arcjet({
    key: env.ARCJET_KEY,
    rules: [
      tokenBucket({
        mode: "LIVE",
        characteristics: ["ip.src"],
        refillRate,
        interval,
        capacity,
      }),
    ],
  });

  return async (req: Request, _res: Response, next: NextFunction) => {
    const decision = await aj.protect(req, { requested: 1 });

    if (decision.isDenied()) {
      throw new AppError("Too many requests. Please slow down.", 429);
    }

    next();
  };
};
