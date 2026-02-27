import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllAttachmentsByLeadId,
  createAttachmentForLead,
  generateUploadUrl,
  uploadFileToS3,
} from "@/api/services";

export const useAttachments = ({
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
    queryKey: ["attachments", leadId, { cursor, limit, search }],
    queryFn: () => getAllAttachmentsByLeadId({ leadId, cursor, limit, search }),
    enabled: enabled ?? !!leadId,
  });
};

export const useCreateAttachment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      type: string;
      leadId: string;
      file: File;
    }) => {
      const { type, file, leadId } = payload;

      const uploadData = await generateUploadUrl({
        type,
        fileName: file.name,
        fileType: file.type || "application/octet-stream",
      });

      await uploadFileToS3(
        uploadData.signedUrl,
        file,
        file.type || "application/octet-stream",
      );

      return createAttachmentForLead({
        leadId,
        fileName: file.name,
        fileType: file.type || "unknown",
        fileUrl: uploadData.fileUrl,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["attachments", variables.leadId],
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
