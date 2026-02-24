import {
  fetchTenantDashboardStatsService,
  fetchTenantsService,
  fetchTenantByIdService,
  createTenantService,
  updateTenantByIdService,
  deleteTenantByIdService,
  createUserForTenantService,
  fetchUsersByTenantIdService,
} from "../services/tenant.service.js";

export const getTenantDashboardStats = async (req, res, next) => {
  try {
    const { stats, recentTenants, planDistribution } =
      await fetchTenantDashboardStatsService();

    res.json({
      success: true,
      message: "Tenant dashboard stats retrieved successfully",
      data: { stats, recentTenants, planDistribution },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllTenants = async (req, res, next) => {
  try {
    const cursor = req.query.cursor;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search;

    const { tenants, totalCount } = await fetchTenantsService({
      cursor,
      limit,
      search,
    });

    res.json({
      success: true,
      message: "Tenants retrieved successfully",
      data: { tenants, totalCount },
    });
  } catch (error) {
    next(error);
  }
};

export const getTenantById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Tenant ID is required",
      });
    }

    const { tenant, usersCount } = await fetchTenantByIdService({ id });

    res.json({
      success: true,
      message: "Tenant retrieved successfully",
      data: { tenant, usersCount },
    });
  } catch (error) {
    next(error);
  }
};

export const getUsersByTenantId = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Tenant ID is required",
      });
    }

    const { users } = await fetchUsersByTenantIdService({ tenantId: id });

    res.json({
      success: true,
      message: "Tenant users retrieved successfully",
      data: { users },
    });
  } catch (error) {
    next(error);
  }
};

export const createTenant = async (req, res, next) => {
  try {
    const { name, gstNumber, panNumber, email, mobile, address, plan } =
      req.body;
    if (!name || !email || !mobile || !plan) {
      return res.status(400).json({
        success: false,
        message: "Name, Email, Mobile, and Plan are required",
      });
    }

    const tenant = await createTenantService({
      name,
      gstNumber,
      panNumber,
      email,
      mobile,
      address,
      plan,
    });
    if (!tenant) {
      return res
        .status(400)
        .json({ success: false, message: "Failed to create tenant" });
    }

    res.status(201).json({
      success: true,
      message: "Tenant created successfully",
      data: { tenant },
    });
  } catch (error) {
    next(error);
  }
};

export const updateTenantById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Tenant ID is required",
      });
    }

    const { name, gstNumber, panNumber, email, mobile, address, plan } =
      req.body;
    if (!name && !email && !mobile) {
      return res.status(400).json({
        success: false,
        message:
          "At least one field (name, email, mobile) is required to update",
      });
    }

    const updatedTenant = await updateTenantByIdService({
      id,
      name,
      gstNumber,
      panNumber,
      email,
      mobile,
      address,
      plan,
    });

    if (!updatedTenant) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found",
      });
    }

    res.json({
      success: true,
      message: "Tenant updated successfully",
      data: { updatedTenant },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTenantById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Tenant ID is required",
      });
    }

    const deleted = await deleteTenantByIdService({ id });
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found",
      });
    }

    res.json({
      success: true,
      message: "Tenant deleted successfully",
      data: { id },
    });
  } catch (error) {
    next(error);
  }
};

export const createUserForTenant = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Tenant ID is required",
      });
    }

    const { name, email, mobile, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, Email, Password, and Role are required",
      });
    }

    const user = await createUserForTenantService({
      tenantId: id,
      name,
      email,
      mobile,
      password,
      role,
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Failed to create user for tenant",
      });
    }

    res.json({
      success: true,
      message: "Tenant user created successfully",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};
