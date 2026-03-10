import { Schema, model } from "mongoose";
import { TrackingDocument } from "../types/models/tracking.model.types";

const geoFields = {
  ipAddress: { type: String, trim: true },
  userAgent: { type: String, trim: true },
  city: { type: String, trim: true },
  country: { type: String, trim: true },
  isp: { type: String, trim: true },
  lat: { type: String, trim: true },
  lon: { type: String, trim: true },
  region: { type: String, trim: true },
};

const openSchema = new Schema({
  ...geoFields,
  createdAt: { type: Date, default: Date.now },
});

const clickSchema = new Schema({
  url: { type: String, trim: true, required: true },
  ...geoFields,
  createdAt: { type: Date, default: Date.now },
});

const trackingSchema = new Schema<TrackingDocument>(
  {
    emailId: {
      type: Schema.Types.ObjectId,
      ref: "Email",
      required: true,
    },
    openedAt: {
      type: Date,
      default: null,
    },
    openCount: {
      type: Number,
      default: 0,
    },
    clickCount: {
      type: Number,
      default: 0,
    },
    opens: [openSchema],
    clicks: [clickSchema],
  },
  {
    timestamps: true,
    collection: "tracking",
    versionKey: "version",
  },
);

export const Tracking = model<TrackingDocument>("Tracking", trackingSchema);
