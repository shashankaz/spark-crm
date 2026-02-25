import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllCommentsByLeadId, createCommentForLead } from "@/api/services";

export const useComments = ({
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
    queryKey: ["comments", leadId, { cursor, limit, search }],
    queryFn: () => getAllCommentsByLeadId({ leadId, cursor, limit, search }),
    enabled: enabled ?? !!leadId,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCommentForLead,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.leadId],
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
