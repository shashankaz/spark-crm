import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getTenantDashboardStats,
  getAllTenants,
  getTenantById,
  getUsersByTenantId,
  createTenant,
  updateTenantById,
  deleteTenantById,
  createUserForTenant,
} from "@/api/services/tenant.service";

export const useTenantDashboardStats = () => {
  return useQuery({
    queryKey: ["tenant", "dashboard"],
    queryFn: getTenantDashboardStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useTenants = ({
  cursor,
  limit = 10,
  search,
}: {
  cursor?: string;
  limit?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["tenants", { cursor, limit, search }],
    queryFn: () => getAllTenants({ cursor, limit, search }),
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
