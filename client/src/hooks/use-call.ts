import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllCallsByLeadId,
  createCallForLead,
} from "@/api/services/call.service";

export const useCalls = ({
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
  return useQuery({
    queryKey: ["calls", leadId, { cursor, limit, search }],
    queryFn: () => getAllCallsByLeadId({ leadId, cursor, limit, search }),
    enabled: enabled ?? !!leadId,
  });
};

export const useCreateCall = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCallForLead,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["calls", variables.leadId],
      });
      queryClient.invalidateQueries({
        queryKey: ["lead", variables.leadId],
      });
      queryClient.removeQueries({
        queryKey: ["lead-activity", variables.leadId],
      });
    },
  });
};
