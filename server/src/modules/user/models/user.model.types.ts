import { Types, Document } from "mongoose";

export type UserRole = "user" | "admin" | "super_admin";

export interface UserBase {
  firstName: string;
  lastName?: string;
  email: string;
  mobile?: string;
  password?: string;
  role: UserRole;
  tenantId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDocument extends UserBase, Document {
  _id: Types.ObjectId;
}
