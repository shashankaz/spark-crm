import { Types, Document } from "mongoose";

export interface EmailBase {
  leadId: Types.ObjectId;

  to: string;
  subject: string;
  bodyHtml: string;
  bodyText: string;
  status: "sent" | "failed" | "draft";
  trackingId: Types.ObjectId | null;

  createdAt: Date;
  updatedAt: Date;
}

export interface EmailDocument extends EmailBase, Document {
  _id: Types.ObjectId;
}
