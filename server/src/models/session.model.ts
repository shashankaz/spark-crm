import { Schema, model } from "mongoose";
import { SessionDocument } from "../types/models/session.model.types";

const sessionSchema = new Schema<SessionDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    token: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: "sessions",
    versionKey: "version",
  },
);

sessionSchema.index({ userId: 1 });

export const Session = model<SessionDocument>("Session", sessionSchema);
