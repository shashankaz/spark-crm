import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { buildQueryParams } from "@/api/query-params";
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContactById,
  toggleContactStar,
  deleteContactById,
  bulkDeleteContacts,
} from "@/api/services";
import type { GetAllContactsRequest } from "@/types/services";

export const useContacts = (params: GetAllContactsRequest) => {
  const query = buildQueryParams({
    cursor: params.cursor,
    limit: params.limit,
    search: params.search,
    starred: params.starred !== undefined ? String(params.starred) : undefined,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder,
  });

  return useQuery({
    queryKey: ["contacts", query],
    queryFn: () => getAllContacts(params),
  });
};

export const useContact = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: ["contact", id],
    queryFn: () => getContactById({ id }),
    enabled: !!id,
  });
};

export const useCreateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
};

export const useUpdateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateContactById,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      queryClient.invalidateQueries({ queryKey: ["contact", variables.id] });
    },
  });
};

export const useToggleContactStar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleContactStar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
};

export const useDeleteContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteContactById,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      queryClient.removeQueries({ queryKey: ["contact", variables.id] });
    },
  });
};

export const useBulkDeleteContacts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeleteContacts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
};
