import { Tracking } from "../models/tracking.model";
import { getIPDetails } from "../../../utils/auth/get-ip-details";
import { parseAndValidateUrl } from "../../../utils/parse-and-validate-url";
import {
  RecordEmailOpenInput,
  RecordEmailClickInput,
} from "./tracking.service.types";

export const recordEmailOpenService = async ({
  trackingId,
  ipAddress: rawIpAddress,
  userAgent,
}: RecordEmailOpenInput): Promise<void> => {
  const now = new Date();
  const ipAddress = Array.isArray(rawIpAddress)
    ? rawIpAddress[0]
    : rawIpAddress;

  const ipAddressDetails = await getIPDetails({
    ipAddress: ipAddress || "",
  });

  await Tracking.updateOne({ trackingId }, [
    {
      $set: {
        openCount: { $add: ["$openCount", 1] },
        openedAt: { $ifNull: ["$firstOpenedAt", now] },
      },
    },
  ]).exec();

  await Tracking.updateOne(
    { trackingId },
    {
      $push: {
        opens: { ipAddress, userAgent, ...ipAddressDetails, createdAt: now },
      },
    },
  ).exec();
};

export const recordEmailClickService = async ({
  trackingId,
  url,
  ipAddress: rawIpAddress,
  userAgent,
}: RecordEmailClickInput): Promise<URL> => {
  const parsedUrl = parseAndValidateUrl({ url });
  const ipAddress = Array.isArray(rawIpAddress)
    ? rawIpAddress[0]
    : rawIpAddress;

  if (trackingId) {
    const now = new Date();

    const ipAddressDetails = await getIPDetails({
      ipAddress: ipAddress || "",
    });

    await Tracking.updateOne({ trackingId }, [
      {
        $set: {
          clickCount: { $add: ["$clickCount", 1] },
        },
      },
    ]).exec();

    await Tracking.updateOne(
      { trackingId },
      {
        $push: {
          clicks: {
            url: parsedUrl.toString(),
            ipAddress,
            userAgent,
            ...ipAddressDetails,
            createdAt: now,
          },
        },
      },
    ).exec();
  }

  return parsedUrl;
};
