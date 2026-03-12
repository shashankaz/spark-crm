import { Request, Response } from "express";
import { asyncHandler } from "../../shared/async-handler";
import { AppError } from "../../shared/app-error";
import {
  recordEmailOpenService,
  recordEmailClickService,
} from "./services/tracking.service";

const TRANSPARENT_1X1_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
  "base64",
);

export const trackEmailOpen = asyncHandler(
  async (req: Request, res: Response) => {
    const trackingId = req.params.trackingId as string;

    if (!trackingId) {
      return res
        .status(400)
        .set({
          "Content-Type": "image/png",
          "Content-Length": TRANSPARENT_1X1_PNG.length,
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        })
        .end(TRANSPARENT_1X1_PNG);
    }

    const forwardedFor = req.headers["x-forwarded-for"];
    const ipAddress = Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : forwardedFor;
    const userAgent = req.headers["user-agent"];

    await recordEmailOpenService({ trackingId, ipAddress, userAgent });

    res
      .status(200)
      .set({
        "Content-Type": "image/png",
        "Content-Length": TRANSPARENT_1X1_PNG.length,
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      })
      .end(TRANSPARENT_1X1_PNG);
  },
);

export const trackEmailClick = asyncHandler(
  async (req: Request, res: Response) => {
    const trackingId = req.params.trackingId as string;
    const { url } = req.query;

    if (!url || typeof url !== "string") {
      throw new AppError("Missing url parameter", 400);
    }

    const validUrl: string = url;
    const forwardedFor = req.headers["x-forwarded-for"];
    const ipAddress = Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : forwardedFor;
    const userAgent = req.headers["user-agent"];

    const parsedUrl = await recordEmailClickService({
      trackingId,
      url: validUrl,
      ipAddress,
      userAgent,
    });

    return res.redirect(302, parsedUrl.toString());
  },
);
