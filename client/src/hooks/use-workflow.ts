import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { buildQueryParams } from "@/api/query-params";
import {
  getAllWorkflows,
  getWorkflowById,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
  toggleWorkflow,
} from "@/api/services";

export const useWorkflows = ({
  cursor,
  limit = 20,
  search,
}: {
  cursor?: string;
  limit?: number;
  search?: string;
}) => {
  const query = buildQueryParams({ cursor, limit, search });

  return useQuery({
    queryKey: ["workflows", query],
    queryFn: () => getAllWorkflows({ cursor, limit, search }),
  });
};

export const useWorkflow = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: ["workflow", id],
    queryFn: () => getWorkflowById({ id }),
    enabled: !!id,
  });
};

export const useCreateWorkflow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWorkflow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
    },
  });
};

export const useUpdateWorkflow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateWorkflow,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
      queryClient.invalidateQueries({ queryKey: ["workflow", variables.id] });
    },
  });
};

export const useDeleteWorkflow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteWorkflow,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
      queryClient.removeQueries({ queryKey: ["workflow", variables.id] });
    },
  });
};

export const useToggleWorkflow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleWorkflow,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
      queryClient.invalidateQueries({ queryKey: ["workflow", variables.id] });
    },
  });
};
