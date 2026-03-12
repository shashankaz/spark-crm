import { formatDate } from "date-fns";
import { User } from "../models/user.model";
import { hashPassword } from "../../../utils/auth/bcrypt";
import { AppError } from "../../../shared/app-error";
import { deleteUserWithCascade } from "../../../services/cascade-delete.service";
import {
  IFetchUsersInput,
  IFetchUserByIdInput,
  ICreateUserInput,
  IUpdateUserInput,
  IRemoveUserInput,
} from "./user.service.types";
import { UserRole } from "../models/user.model.types";

export const fetchUsersService = async ({
  tenantId,
  cursor,
  limit,
  search,
}: IFetchUsersInput) => {
  const countQuery: any = { tenantId };
  if (search) {
    countQuery.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const whereQuery: any = { ...countQuery };
  if (cursor) {
    whereQuery._id = { $gt: cursor };
  }

  const [totalCount, users] = await Promise.all([
    User.countDocuments(countQuery).exec(),
    User.find(whereQuery).sort({ _id: -1 }).limit(limit).exec(),
  ]);

  const formattedUsers = users.map((user) => ({
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    mobile: user.mobile,
    role: user.role,
    updatedAt: formatDate(user.updatedAt, "dd/MM/yyyy"),
  }));

  return { users: formattedUsers, totalCount };
};

export const fetchUserByIdService = async ({
  tenantId,
  id,
}: IFetchUserByIdInput) => {
  return await User.findOne({ _id: id, tenantId }).exec();
};

export const createUserService = async ({
  tenantId,
  firstName,
  lastName,
  email,
  mobile,
  password,
  role,
}: ICreateUserInput) => {
  const hashedPassword = password ? await hashPassword(password) : undefined;

  const newUser = new User({
    firstName,
    lastName: lastName || undefined,
    email,
    mobile: mobile || undefined,
    password: hashedPassword,
    role: role || "user",
    tenantId,
  });

  return await newUser.save();
};

export const updateUserService = async ({
  tenantId,
  id,
  firstName,
  lastName,
  email,
  mobile,
  password,
  role,
}: IUpdateUserInput) => {
  const user = await User.findOne({ _id: id, tenantId }).exec();
  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (email) user.email = email;
  if (mobile) user.mobile = mobile;
  if (password) user.password = await hashPassword(password);
  if (role) user.role = role as UserRole;

  return await user.save();
};

export const removeUserService = async ({ tenantId, id }: IRemoveUserInput) => {
  const user = await User.findOne({ _id: id, tenantId }).exec();
  if (!user) {
    throw new AppError("User not found", 404);
  }

  return await deleteUserWithCascade({ userId: id });
};
