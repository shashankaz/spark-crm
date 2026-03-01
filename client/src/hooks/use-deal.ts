import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllDeals, getDeal, updateDeal, deleteDeal } from "@/api/services";

export const useDeals = ({
  cursor,
  limit = 10,
  search,
}: {
  cursor?: string;
  limit?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["deals", { cursor, limit, search }],
    queryFn: () => getAllDeals({ cursor, limit, search }),
  });
};

export const useDeal = ({
  id,
  enabled = true,
}: {
  id: string;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ["deal", id],
    queryFn: () => getDeal({ id }),
    enabled: !!id && enabled,
  });
};

export const useUpdateDeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDeal,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      queryClient.invalidateQueries({ queryKey: ["deal", variables.id] });
    },
  });
};

export const useDeleteDeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDeal,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      queryClient.removeQueries({ queryKey: ["deal", variables.id] });
    },
  });
};
