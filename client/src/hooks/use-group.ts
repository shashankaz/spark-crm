import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { buildQueryParams } from "@/api/query-params";
import {
  createGroup,
  getGroups,
  getGroup,
  updateGroup,
  deleteGroup,
  sendCampaignToGroup,
} from "@/api/services";

export const useGroups = ({
  search,
  sortBy,
  sortOrder,
}: {
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  const query = buildQueryParams({
    search,
    sortBy,
    sortOrder,
  });

  return useQuery({
    queryKey: ["groups", query],
    queryFn: () => getGroups({ search, sortBy, sortOrder }),
  });
};

export const useGroup = (id: string) => {
  return useQuery({
    queryKey: ["groups", id],
    queryFn: () => getGroup({ id }),
    enabled: !!id,
  });
};

export const useCreateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
};

export const useUpdateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateGroup,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.invalidateQueries({ queryKey: ["groups", variables.id] });
    },
  });
};

export const useDeleteGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGroup,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.removeQueries({ queryKey: ["groups", variables.id] });
    },
  });
};

export const useSendCampaignGroup = () => {
  return useMutation({
    mutationFn: sendCampaignToGroup,
  });
};
