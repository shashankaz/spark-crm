import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { buildQueryParams } from "@/api/query-params";
import {
  getAllLeads,
  getLeadById,
  createLead,
  updateLeadById,
  deleteLeadById,
  getLeadOrganizations,
  getLeadActivityByLeadId,
  convertLeadToDeal,
  assignLead,
} from "@/api/services";

export const useLeads = ({
  cursor,
  limit = 10,
  search,
  orgId,
}: {
  cursor?: string;
  limit?: number;
  search?: string;
  orgId?: string;
}) => {
  const query = buildQueryParams({ cursor, limit, search, orgId });

  return useQuery({
    queryKey: ["leads", query],
    queryFn: () => getAllLeads({ cursor, limit, search, orgId }),
  });
};

export const useLead = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: ["lead", id],
    queryFn: () => getLeadById({ id }),
    enabled: !!id,
  });
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
};

export const useUpdateLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateLeadById,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["lead", variables.id] });
      queryClient.invalidateQueries({
        queryKey: ["lead-activity", variables.id],
      });
    },
  });
};

export const useDeleteLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLeadById,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.removeQueries({ queryKey: ["lead", variables.id] });
      queryClient.removeQueries({
        queryKey: ["lead-activity", variables.id],
      });
    },
  });
};

export const useLeadOrganizations = ({
  limit = 10,
  search,
}: {
  limit?: number;
  search?: string;
}) => {
  const query = buildQueryParams({ limit, search });

  return useQuery({
    queryKey: ["lead-organizations", query],
    queryFn: () => getLeadOrganizations({ limit, search }),
  });
};

export const useLeadActivity = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: ["lead-activity", id],
    queryFn: () => getLeadActivityByLeadId({ id }),
    enabled: !!id,
  });
};

export const useConvertLeadToDeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: convertLeadToDeal,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["lead", variables.id] });
      queryClient.invalidateQueries({
        queryKey: ["lead-activity", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["deals"] });
    },
  });
};

export const useAssignLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignLead,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["lead", variables.id] });
      queryClient.invalidateQueries({
        queryKey: ["lead-activity", variables.id],
      });
    },
  });
};
