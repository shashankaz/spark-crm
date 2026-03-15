import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { buildQueryParams } from "@/api/query-params";
import {
  getTenantDashboardStats,
  getAllTenants,
  getTenantById,
  getUsersByTenantId,
  createTenant,
  updateTenantById,
  deleteTenantById,
  createUserForTenant,
  exportTenants,
  getAvailableSlug,
  getAdminTenantGrowth,
  getAdminRevenue,
  getAdminPlanDistributionChart,
  getAdminUserGrowth,
  getAdminTopTenants,
} from "@/api/services";

export const useTenantDashboardStats = () => {
  return useQuery({
    queryKey: ["tenant", "dashboard"],
    queryFn: getTenantDashboardStats,
    staleTime: 1000 * 60 * 5,
  });
};

export const useAdminTenantGrowth = () => {
  return useQuery({
    queryKey: ["tenant", "dashboard", "tenant-growth"],
    queryFn: getAdminTenantGrowth,
    staleTime: 1000 * 60 * 5,
  });
};

export const useAdminRevenue = () => {
  return useQuery({
    queryKey: ["tenant", "dashboard", "admin-revenue"],
    queryFn: getAdminRevenue,
    staleTime: 1000 * 60 * 5,
  });
};

export const useAdminPlanDistributionChart = () => {
  return useQuery({
    queryKey: ["tenant", "dashboard", "plan-distribution-chart"],
    queryFn: getAdminPlanDistributionChart,
    staleTime: 1000 * 60 * 5,
  });
};

export const useAdminUserGrowth = () => {
  return useQuery({
    queryKey: ["tenant", "dashboard", "user-growth"],
    queryFn: getAdminUserGrowth,
    staleTime: 1000 * 60 * 5,
  });
};

export const useAdminTopTenants = () => {
  return useQuery({
    queryKey: ["tenant", "dashboard", "top-tenants"],
    queryFn: getAdminTopTenants,
    staleTime: 1000 * 60 * 5,
  });
};

export const useTenants = ({
  cursor,
  limit = 10,
  search,
  plan,
  country,
}: {
  cursor?: string;
  limit?: number;
  search?: string;
  plan?: string;
  country?: string;
}) => {
  const query = buildQueryParams({ cursor, limit, search, plan, country });

  return useQuery({
    queryKey: ["tenants", query],
    queryFn: () => getAllTenants({ cursor, limit, search, plan, country }),
  });
};

export const useTenant = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: ["tenant", id],
    queryFn: () => getTenantById({ id }),
    enabled: !!id,
  });
};

export const useUsersByTenantId = ({
  id,
  enabled,
  search,
}: {
  id: string;
  enabled?: boolean;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["tenant", id, "users", search],
    queryFn: () => getUsersByTenantId({ id, search }),
    enabled: enabled ?? !!id,
  });
};

export const useCreateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      queryClient.invalidateQueries({ queryKey: ["tenant", "dashboard"] });
    },
  });
};

export const useUpdateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTenantById,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      queryClient.invalidateQueries({
        queryKey: ["tenant", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["tenant", "dashboard"] });
    },
  });
};

export const useDeleteTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTenantById,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      queryClient.removeQueries({
        queryKey: ["tenant", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["tenant", "dashboard"] });
    },
  });
};

export const useCreateUserForTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUserForTenant,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tenant", variables.tenantId],
      });
    },
  });
};

export const useExportTenants = () => {
  return useMutation({
    mutationFn: exportTenants,
  });
};

export const useCheckSlugAvailability = () => {
  return useMutation({
    mutationFn: getAvailableSlug,
  });
};
