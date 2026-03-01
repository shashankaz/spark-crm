import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createGroup,
  getGroups,
  getGroup,
  updateGroup,
  deleteGroup,
  sendCampaignToGroup,
} from "@/api/services";

export const useGroups = () => {
  return useQuery({
    queryKey: ["groups"],
    queryFn: getGroups,
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
