import { Types } from "mongoose";

export interface IFetchUsersInput {
  tenantId: Types.ObjectId;
  cursor?: Types.ObjectId;
  limit: number;
  search?: string;
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
  role?: string;
}

export interface IUpdateUserInput {
  tenantId: Types.ObjectId;
  id: Types.ObjectId;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  password?: string;
  role?: string;
}

export interface IRemoveUserInput {
  tenantId: Types.ObjectId;
  id: Types.ObjectId;
}
