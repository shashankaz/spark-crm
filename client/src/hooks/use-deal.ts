import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { buildQueryParams } from "@/api/query-params";
import {
  getAllDeals,
  getDeal,
  updateDeal,
  deleteDeal,
  exportDeals,
} from "@/api/services";

export const useDeals = ({
  cursor,
  limit = 10,
  search,
  valueRange,
  probability,
  sortBy,
  sortOrder,
}: {
  cursor?: string;
  limit?: number;
  search?: string;
  valueRange?: string;
  probability?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  const query = buildQueryParams({
    cursor,
    limit,
    search,
    valueRange,
    probability,
    sortBy,
    sortOrder,
  });

  return useQuery({
    queryKey: ["deals", query],
    queryFn: () =>
      getAllDeals({
        cursor,
        limit,
        search,
        valueRange,
        probability,
        sortBy,
        sortOrder,
      }),
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

export const useExportDeals = () => {
  return useMutation({
    mutationFn: exportDeals,
  });
};
