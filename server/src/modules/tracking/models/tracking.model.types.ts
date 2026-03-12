import { Types, Document } from "mongoose";

export interface IGeoInfo {
  ipAddress?: string;
  userAgent?: string;
  city?: string;
  country?: string;
  isp?: string;
  lat?: string;
  lon?: string;
  region?: string;
}

export interface IOpenEntry extends IGeoInfo {
  createdAt: Date;
}

export interface IClickEntry extends IGeoInfo {
  url: string;
  createdAt: Date;
}

export interface ITrackingBase {
  emailId: Types.ObjectId;

  openedAt: Date | null;
  openCount: number;
  clickCount: number;

  opens: IOpenEntry[];
  clicks: IClickEntry[];
}

export interface ITrackingDocument extends ITrackingBase, Document {
  _id: Types.ObjectId;
}
