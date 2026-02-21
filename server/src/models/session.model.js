import { Schema, model } from "mongoose";

const sessionSchema = Schema(
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

export const Session = model("Session", sessionSchema);
