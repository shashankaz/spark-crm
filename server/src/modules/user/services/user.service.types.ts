import { Types } from "mongoose";
import { UserRole } from "../models/user.model.types";

export interface IFetchUsersInput {
  tenantId: Types.ObjectId;
  cursor?: Types.ObjectId;
  limit: number;
  search?: string;
  role?: UserRole;
}

export interface IFetchUserByIdInput {
  tenantId: Types.ObjectId;
  id: Types.ObjectId;
}

export interface ICreateUserInput {
  tenantId: Types.ObjectId;
  firstName: string;
  lastName?: string;
  email: string;
  mobile?: string;
  password?: string;
  role?: UserRole;
}

export interface IUpdateUserInput {
  tenantId: Types.ObjectId;
  id: Types.ObjectId;
  firstName?: string;
  lastName?: string;
  mobile?: string;
  role?: UserRole;
}

export interface IRemoveUserInput {
  tenantId: Types.ObjectId;
  id: Types.ObjectId;
  userId: Types.ObjectId;
}

export interface IGeneratePasswordInput {
  tenantId: Types.ObjectId;
  id: Types.ObjectId;
}
