import { Types, Document } from "mongoose";

export type UserRole = "user" | "admin" | "super_admin";

export interface IUserBase {
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

export interface IUserDocument extends IUserBase, Document {
  _id: Types.ObjectId;
}
