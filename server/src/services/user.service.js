import { formatDate } from "date-fns";
import { User } from "../models/user.model.js";
import { hashPassword } from "../utils/auth/bcrypt.js";
import { AppError } from "../shared/app-error.js";

export const fetchUsersService = async ({
  tenantId,
  cursor,
  limit,
  search,
}) => {
  const countQuery = { tenantId };
  if (search) {
    countQuery.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const whereQuery = { ...countQuery };
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

export const fetchUserByIdService = async ({ tenantId, id }) => {
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
}) => {
  const hashedPassword = await hashPassword(password);

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
}) => {
  const user = await User.findOne({ _id: id, tenantId }).exec();
  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (email) user.email = email;
  if (mobile) user.mobile = mobile;
  if (password) user.password = await hashPassword(password);
  if (role) user.role = role;

  return await user.save();
};

export const removeUserService = async ({ tenantId, id }) => {
  const user = await User.findOne({ _id: id, tenantId }).exec();
  if (!user) {
    throw new AppError("User not found", 404);
  }

  return await User.deleteOne({ _id: id, tenantId }).exec();
};
