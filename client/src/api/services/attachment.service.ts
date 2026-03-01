import { api } from "@/api";
import { withApiHandler } from "@/api/api-handler";
import { buildQueryParams } from "@/api/query-params";
import type { ApiResponse } from "@/api/api-response";
import type {
  AttachmentData,
  AttachmentsData,
  CreateAttachmentForLeadRequest,
  CreateAttachmentResponse,
  GenerateUploadUrlRequest,
  GenerateUploadUrlResponse,
  GetAllAttachmentsByLeadIdRequest,
  GetAttachmentsResponse,
  UploadUrlData,
} from "@/types/services";

export const getAllAttachmentsByLeadId = async (
  params: GetAllAttachmentsByLeadIdRequest,
): Promise<GetAttachmentsResponse> =>
  withApiHandler(async () => {
    const { leadId, cursor, limit = 10, search } = params;
    const query = buildQueryParams({ cursor, limit, search });
    const response = await api.get<ApiResponse<AttachmentsData>>(
      `/attachment/${leadId}${query ? `?${query}` : ""}`,
    );

    const { message, data } = response.data;

    return {
      message,
      attachments: data.attachments,
      totalCount: data.totalCount,
    };
  });

export const createAttachmentForLead = async (
  params: CreateAttachmentForLeadRequest,
): Promise<CreateAttachmentResponse> =>
  withApiHandler(async () => {
    const { leadId, fileName, fileUrl, fileType } = params;
    const response = await api.post<ApiResponse<AttachmentData>>(
      `/attachment/${leadId}`,
      {
        leadId,
        fileName,
        fileUrl,
        fileType,
      },
    );

    const { message, data } = response.data;

    return {
      message,
      attachment: data.attachment,
    };
  });

export const generateUploadUrl = async (
  params: GenerateUploadUrlRequest,
): Promise<GenerateUploadUrlResponse> =>
  withApiHandler(async () => {
    const { type, fileName, fileType } = params;
    const response = await api.post<ApiResponse<UploadUrlData>>("/upload", {
      type,
      fileName,
      fileType,
    });

    const { message, data } = response.data;

    return {
      message,
      signedUrl: data.signedUrl,
      key: data.key,
      fileUrl: data.fileUrl,
    };
  });

export const uploadFileToS3 = async (
  signedUrl: string,
  file: File,
  fileType: string,
): Promise<void> =>
  withApiHandler(async () => {
    const response = await fetch(signedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": fileType,
      },
      body: file,
    });

    if (!response.ok) {
      throw new Error(`S3 upload failed with status ${response.status}`);
    }
  });
