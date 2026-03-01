import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllEmailsByLeadId, sendEmailForLead } from "@/api/services";
import { buildQueryParams } from "@/api/query-params";

export const useEmails = ({
  leadId,
  cursor,
  limit = 10,
  search,
  enabled,
}: {
  leadId: string;
  cursor?: string;
  limit?: number;
  search?: string;
  enabled?: boolean;
}) => {
  const query = buildQueryParams({ cursor, limit, search });

  return useQuery({
    queryKey: ["emails", leadId, query],
    queryFn: () => getAllEmailsByLeadId({ leadId, cursor, limit, search }),
    enabled: enabled ?? !!leadId,
  });
};

export const useSendEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendEmailForLead,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["emails", variables.leadId],
      });
      queryClient.invalidateQueries({
        queryKey: ["lead-activity", variables.leadId],
      });
    },
  });
};
