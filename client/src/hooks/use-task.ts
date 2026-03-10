import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} from "@/api/services";

export const useTasks = ({
  search,
  status,
  priority,
}: {
  search?: string;
  status?: string;
  priority?: string;
}) => {
  return useQuery({
    queryKey: ["tasks", { search, status, priority }],
    queryFn: () => getAllTasks({ search, status, priority }),
  });
};

export const useTask = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: ["task", id],
    queryFn: () => getTask({ id }),
    enabled: !!id,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTask,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", variables.id] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
