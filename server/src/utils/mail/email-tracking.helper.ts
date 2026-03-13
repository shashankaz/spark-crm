import { Types } from "mongoose";
import { Tracking } from "../../modules/tracking/models/tracking.model";
import { env } from "../../config/env";

export async function createEmailTracking(
  emailId: Types.ObjectId,
): Promise<string> {
  const tracking = await Tracking.create({
    emailId,
    openCount: 0,
    clickCount: 0,
    openedAt: null,
    opens: [],
    clicks: [],
  });

  return (tracking._id as Types.ObjectId).toString();
}

export function injectEmailTracking(
  bodyHtml: string,
  trackingId: string,
): string {
  const base = env.SERVER_BASE_URL.replace(/\/$/, "");

  const trackedHtml = bodyHtml.replace(
    /<a\s([^>]*?)href=(["'])(https?:\/\/[^"']+)\2([^>]*?)>/gi,
    (_match, before, quote, url, after) => {
      if (url.includes("/api/v1/tracking/")) return _match;
      const encodedUrl = encodeURIComponent(url);
      const trackingUrl = `${base}/api/v1/tracking/click/${trackingId}?url=${encodedUrl}`;
      return `<a ${before}href=${quote}${trackingUrl}${quote}${after}>`;
    },
  );

  const pixel = `<img src="${base}/api/v1/tracking/open/${trackingId}" width="1" height="1" style="display:none;border:0;outline:none;" alt="" />`;

  if (/<\/body>/i.test(trackedHtml)) {
    return trackedHtml.replace(/<\/body>/i, `${pixel}</body>`);
  }

  return `${trackedHtml}${pixel}`;
}
