import { Schema, model } from "mongoose";
import { IUserDocument } from "./user.model.types";

const userSchema = new Schema<IUserDocument>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      immutable: true,
    },
    mobile: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin", "super_admin"],
      default: "user",
    },
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "users",
    versionKey: "version",
  },
);

userSchema.index({ tenantId: 1 });

userSchema.pre("save", async function () {
  if (this.email) this.email = this.email.toLowerCase();
});

export const User = model<IUserDocument>("User", userSchema);
