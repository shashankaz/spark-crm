import { Types } from "mongoose";

export interface FetchUsersInput {
  tenantId: Types.ObjectId;
  cursor?: Types.ObjectId;
  limit: number;
  search?: string;
}

export interface FetchUserByIdInput {
  tenantId: Types.ObjectId;
  id: Types.ObjectId;
}

export interface CreateUserInput {
  tenantId: Types.ObjectId;
  firstName: string;
  lastName?: string;
  email: string;
  mobile?: string;
  password?: string;
  role?: string;
}

export interface UpdateUserInput {
  tenantId: Types.ObjectId;
  id: Types.ObjectId;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  password?: string;
  role?: string;
}

export interface RemoveUserInput {
  tenantId: Types.ObjectId;
  id: Types.ObjectId;
}
