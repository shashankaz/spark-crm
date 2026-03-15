import type { Tenant, User } from "@/types/domain";

export type TenantAddress = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type TenantDashboardStat = {
  value: number;
  change: string;
  trend: "up" | "down";
};

export type TenantRecentTenant = {
  _id: string;
  name: string;
  email: string;
  plan: string;
  city: string;
  country: string;
  createdAt: string;
};

export type TenantPlanDistribution = {
  plan: string;
  count: number;
};

export type TenantDashboardStatsData = {
  stats: {
    totalTenants: TenantDashboardStat;
    totalUsers: TenantDashboardStat;
    monthlyRevenue: TenantDashboardStat;
    paidPlans: TenantDashboardStat;
  };
  recentTenants: TenantRecentTenant[];
  planDistribution: TenantPlanDistribution[];
};

export type TenantGrowthItem = {
  month: string;
  newTenants: number;
};

export type AdminRevenueItem = {
  month: string;
  free: number;
  basic: number;
  pro: number;
  enterprise: number;
  total: number;
};

export type PlanDistributionChartItem = {
  plan: string;
  count: number;
  revenue: number;
};

export type UserGrowthItem = {
  month: string;
  admin: number;
  user: number;
  total: number;
};

export type TopTenantItem = {
  name: string;
  plan: string;
  userCount: number;
  revenue: number;
};

export type AdminWidgetData<T> = {
  data: T[];
};

export type AvailableSlugData = {
  isAvailable: boolean;
};

export type AdminWidgetResponse<T> = {
  message: string;
  data: T[];
};

export type TenantsData = {
  tenants: Tenant[];
  totalCount: number;
};

export type TenantData = {
  tenant: Tenant;
  usersCount?: number;
};

export type CreatedTenantData = {
  tenant: Tenant;
};

export type UpdatedTenantData = {
  updatedTenant: Tenant;
};

export type DeletedTenantData = {
  id: string;
};

export type TenantUsersData = {
  users: User[];
};

export type TenantUserData = {
  user: User;
};

export type GetAllTenantsRequest = {
  cursor?: string;
  limit?: number;
  search?: string;
  plan?: string;
  country?: string;
};

export type GetTenantByIdRequest = {
  id: string;
};

export type GetAvailableSlugRequest = {
  slug: string;
};

export type GetAvailableSlugResponse = {
  message: string;
  isAvailable: boolean;
};

export type CreateTenantRequest = {
  name: string;
  slug: string;
  gstNumber?: string;
  panNumber?: string;
  email: string;
  mobile: string;
  address?: TenantAddress;
  plan?: string;
};

export type UpdateTenantByIdRequest = {
  id: string;
  name?: string;
  gstNumber?: string;
  panNumber?: string;
  email?: string;
  mobile?: string;
  address?: TenantAddress;
  plan?: string;
};

export type DeleteTenantByIdRequest = {
  id: string;
};

export type GetUsersByTenantIdRequest = {
  id: string;
  search?: string;
};

export type CreateUserForTenantRequest = {
  tenantId: string;
  name: string;
  email: string;
  mobile?: string;
  password: string;
  role: string;
};

export type GetTenantDashboardStatsResponse = {
  message: string;
  stats: {
    totalTenants: TenantDashboardStat;
    totalUsers: TenantDashboardStat;
    monthlyRevenue: TenantDashboardStat;
    paidPlans: TenantDashboardStat;
  };
  recentTenants: TenantRecentTenant[];
  planDistribution: TenantPlanDistribution[];
};

export type GetAllTenantsResponse = {
  message: string;
  tenants: Tenant[];
  totalCount: number;
};

export type GetTenantByIdResponse = {
  message: string;
  tenant: Tenant;
  usersCount: number;
};

export type CreateTenantResponse = {
  message: string;
  tenant: Tenant;
};

export type UpdateTenantResponse = {
  message: string;
  tenant: Tenant;
};

export type DeleteTenantResponse = {
  message: string;
  id: string;
};

export type CreateUserForTenantResponse = {
  message: string;
  user: User;
};

export type GetUsersByTenantIdResponse = {
  message: string;
  users: User[];
};

export type ExportTenantsRequest = {
  tenantIds: string[];
  recipientEmail: string;
};

export type ExportTenantsData = {
  messageId: string;
  tenantCount: number;
  recipientEmail: string;
};

export type ExportTenantsResponse = {
  message: string;
  messageId: string;
  tenantCount: number;
  recipientEmail: string;
};
