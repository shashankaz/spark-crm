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
  exportLeads,
  importLeads,
  researchLead,
  bulkDeleteLeads,
} from "@/api/services";

export const useLeads = ({
  cursor,
  limit = 10,
  search,
  orgId,
  assignment,
  scoreRange,
  sortBy,
  sortOrder,
}: {
  cursor?: string;
  limit?: number;
  search?: string;
  orgId?: string;
  assignment?: "all" | "assigned";
  scoreRange?: "any" | "low" | "medium" | "high";
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  const query = buildQueryParams({
    cursor,
    limit,
    search,
    orgId,
    assignment: assignment !== "all" ? assignment : undefined,
    scoreRange: scoreRange !== "any" ? scoreRange : undefined,
    sortBy,
    sortOrder,
  });

  return useQuery({
    queryKey: ["leads", query],
    queryFn: () =>
      getAllLeads({
        cursor,
        limit,
        search,
        assignment,
        scoreRange,
        sortBy,
        sortOrder,
      }),
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

export const useExportLeads = () => {
  return useMutation({
    mutationFn: exportLeads,
  });
};

export const useImportLeads = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: importLeads,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
};

export const useBulkDeleteLeads = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeleteLeads,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
};

export const useResearchLead = () => {
  return useMutation({
    mutationFn: researchLead,
  });
};
