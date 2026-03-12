import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { buildQueryParams } from "@/api/query-params";
import {
  getAllOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganizationById,
  deleteOrganizationById,
  exportOrganizations,
} from "@/api/services";

export const useOrganizations = ({
  cursor,
  limit = 10,
  search,
  industry,
  size,
  country,
}: {
  cursor?: string;
  limit?: number;
  search?: string;
  industry?: string;
  size?: string;
  country?: string;
}) => {
  const query = buildQueryParams({
    cursor,
    limit,
    search,
    industry,
    size,
    country,
  });

  return useQuery({
    queryKey: ["organizations", query],
    queryFn: () =>
      getAllOrganizations({ cursor, limit, search, industry, size, country }),
  });
};

export const useOrganization = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: ["organization", id],
    queryFn: () => getOrganizationById({ id }),
    enabled: !!id,
  });
};

export const useCreateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
};

export const useUpdateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOrganizationById,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({
        queryKey: ["organization", variables.id],
      });
    },
  });
};

export const useDeleteOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteOrganizationById,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.removeQueries({
        queryKey: ["organization", variables.id],
      });
    },
  });
};

export const useExportOrganizations = () => {
  return useMutation({
    mutationFn: exportOrganizations,
  });
};
