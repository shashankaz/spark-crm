import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllEmailTemplates,
  getEmailTemplate,
  createEmailTemplate,
  updateEmailTemplate,
  deleteEmailTemplate,
} from "@/api/services";

export const useEmailTemplates = ({
  search,
  tag,
}: {
  search?: string;
  tag?: string;
} = {}) => {
  return useQuery({
    queryKey: ["email-templates", { search, tag }],
    queryFn: () => getAllEmailTemplates({ search, tag }),
  });
};

export const useEmailTemplate = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: ["email-template", id],
    queryFn: () => getEmailTemplate({ id }),
    enabled: !!id,
  });
};

export const useCreateEmailTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEmailTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-templates"] });
    },
  });
};

export const useUpdateEmailTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateEmailTemplate,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["email-templates"] });
      queryClient.invalidateQueries({
        queryKey: ["email-template", variables.id],
      });
    },
  });
};

export const useDeleteEmailTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEmailTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-templates"] });
    },
  });
};
