import { Request, Response } from "express";
import { Types } from "mongoose";
import {
  fetchUsersService,
  fetchUserByIdService,
  createUserService,
  updateUserService,
  removeUserService,
} from "../services/user.service";
import { AppError } from "../shared/app-error";
import { sendSuccess } from "../shared/api-response";
import { asyncHandler } from "../shared/async-handler";

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const { tenantId } = req.user;
  if (!tenantId) {
    throw new AppError("Tenant ID is missing in user data", 400);
  }

  const cursor = req.query.cursor as Types.ObjectId | undefined;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search as string | undefined;

  const { users, totalCount } = await fetchUsersService({
    tenantId,
    cursor,
    limit,
    search,
  });

  sendSuccess(res, 200, "Users retrieved successfully", {
    users,
    totalCount,
  });
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { tenantId } = req.user;
  if (!tenantId) {
    throw new AppError("Tenant ID is missing in user data", 400);
  }

  const { id } = req.params;
  if (!id) {
    throw new AppError("User ID is required", 400);
  }

  const user = await fetchUserByIdService({ tenantId, id });
  if (!user) {
    throw new AppError("User not found", 404);
  }

  sendSuccess(res, 200, "User retrieved successfully", { user });
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { tenantId } = req.user;
  if (!tenantId) {
    throw new AppError("Tenant ID is missing in user data", 400);
  }

  const { firstName, lastName, email, mobile, password, role } = req.body;
  if (!firstName || !email || !password) {
    throw new AppError("First name, email, and password are required", 400);
  }

  const createdUser = await createUserService({
    tenantId,
    firstName,
    lastName,
    email,
    mobile,
    password,
    role,
  });
  if (!createdUser) {
    throw new AppError("Failed to create user", 400);
  }

  sendSuccess(res, 201, "User created successfully", { createdUser });
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { tenantId } = req.user;
  if (!tenantId) {
    throw new AppError("Tenant ID is missing in user data", 400);
  }

  const { id } = req.params;
  if (!id) {
    throw new AppError("User ID is required", 400);
  }

  const { firstName, lastName, email, mobile, password, role } = req.body;
  if (!firstName && !email && !mobile && !password && !role) {
    throw new AppError(
      "At least one field (first name, email, mobile, password, or role) is required to update",
      400,
    );
  }

  const updatedUser = await updateUserService({
    tenantId,
    id,
    firstName,
    lastName,
    email,
    mobile,
    password,
    role,
  });
  if (!updatedUser) {
    throw new AppError("User not found", 404);
  }

  sendSuccess(res, 200, "User updated successfully", { updatedUser });
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { tenantId } = req.user;

  if (!tenantId) {
    throw new AppError("Tenant ID is missing in user data", 400);
  }

  const { id } = req.params;
  if (!id) {
    throw new AppError("User ID is required", 400);
  }

  const deletedUser = await removeUserService({ tenantId, id });
  if (!deletedUser) {
    throw new AppError("User not found", 404);
  }

  sendSuccess(res, 200, "User deleted successfully", { id });
});
