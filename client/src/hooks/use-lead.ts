import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllLeads,
  getLeadById,
  createLead,
  updateLeadById,
  deleteLeadById,
  getAllOrganizations,
  getLeadActivityByLeadId,
  convertLeadToDeal,
} from "@/api/services/lead.service";

export const useLeads = ({
  cursor,
  limit = 10,
  search,
}: {
  cursor?: string;
  limit?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["leads", { cursor, limit, search }],
    queryFn: () => getAllLeads({ cursor, limit, search }),
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

export const useOrganizations = ({
  limit = 10,
  search,
}: {
  limit?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["lead-organizations", { limit, search }],
    queryFn: () => getAllOrganizations({ limit, search }),
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
