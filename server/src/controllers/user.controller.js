import {
  fetchUsersService,
  fetchUserByIdService,
  createUserService,
  updateUserService,
  removeUserService,
} from "../services/user.service.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const { tenantId } = req.user;
    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: "Tenant ID is missing in user data",
      });
    }

    const cursor = req.query.cursor;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search;

    const { users, totalCount } = await fetchUsersService({
      tenantId,
      cursor,
      limit,
      search,
    });

    res.json({
      success: true,
      message: "Users retrieved successfully",
      data: { users, totalCount },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { tenantId } = req.user;
    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: "Tenant ID is missing in user data",
      });
    }

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await fetchUserByIdService({ tenantId, id });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User retrieved successfully",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { tenantId } = req.user;
    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: "Tenant ID is missing in user data",
      });
    }

    const { firstName, lastName, email, mobile, password, role } = req.body;
    if (!firstName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "First name, email, and password are required",
      });
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
      return res.status(400).json({
        success: false,
        message: "Failed to create user",
      });
    }

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: { createdUser },
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { tenantId } = req.user;
    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: "Tenant ID is missing in user data",
      });
    }

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const { firstName, lastName, email, mobile, password, role } = req.body;
    if (!firstName && !email && !mobile && !password && !role) {
      return res.status(400).json({
        success: false,
        message:
          "At least one field (first name, email, mobile, password, or role) is required to update",
      });
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
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User updated successfully",
      data: { updatedUser },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { tenantId } = req.user;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: "Tenant ID is missing in user data",
      });
    }

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const deletedUser = await removeUserService({ tenantId, id });
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User deleted successfully",
      data: { id },
    });
  } catch (error) {
    next(error);
  }
};
