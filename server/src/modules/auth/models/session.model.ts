import { Schema, model } from "mongoose";
import { ISessionDocument } from "./session.model.types";

const sessionSchema = new Schema<ISessionDocument>(
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

export const Session = model<ISessionDocument>("Session", sessionSchema);
