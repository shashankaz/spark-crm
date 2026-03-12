import { Types, Document } from "mongoose";

export interface GeoInfo {
  ipAddress?: string;
  userAgent?: string;
  city?: string;
  country?: string;
  isp?: string;
  lat?: string;
  lon?: string;
  region?: string;
}

export interface OpenEntry extends GeoInfo {
  createdAt: Date;
}

export interface ClickEntry extends GeoInfo {
  url: string;
  createdAt: Date;
}

export interface TrackingBase {
  emailId: Types.ObjectId;

  openedAt: Date | null;
  openCount: number;
  clickCount: number;

  opens: OpenEntry[];
  clicks: ClickEntry[];
}

export interface TrackingDocument extends TrackingBase, Document {
  _id: Types.ObjectId;
}
