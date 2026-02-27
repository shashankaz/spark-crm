import { api } from "@/api";
import { buildQueryParams } from "@/api/query-params";
import type { Attachment } from "@/types/domain/attachment";

export type GetAttachmentsResponse = {
  message: string;
  attachments: Attachment[];
  totalCount: number;
};

export type CreateAttachmentResponse = {
  message: string;
  attachment: Attachment;
};

export type GenerateUploadUrlResponse = {
  message: string;
  signedUrl: string;
  key: string;
  fileUrl: string;
};

export const getAllAttachmentsByLeadId = async ({
  leadId,
  cursor,
  limit = 10,
  search,
}: {
  leadId: string;
  cursor?: string;
  limit?: number;
  search?: string;
}): Promise<GetAttachmentsResponse> => {
  try {
    const query = buildQueryParams({ cursor, limit, search });
    const response = await api.get(
      `/attachment/${leadId}${query ? `?${query}` : ""}`,
    );

    const { message } = response.data;
    const { attachments, totalCount } = response.data.data;

    return { message, attachments, totalCount };
  } catch (error) {
    console.error("Get attachments error:", error);
    throw error;
  }
};

export const createAttachmentForLead = async ({
  leadId,
  fileName,
  fileUrl,
  fileType,
}: {
  leadId: string;
  fileName: string;
  fileUrl: string;
  fileType?: string;
}): Promise<CreateAttachmentResponse> => {
  try {
    const response = await api.post(`/attachment/${leadId}`, {
      leadId,
      fileName,
      fileUrl,
      fileType,
    });

    const { message } = response.data;
    const { attachment } = response.data.data;

    return { message, attachment };
  } catch (error) {
    console.error("Create attachment error:", error);
    throw error;
  }
};

export const generateUploadUrl = async ({
  type,
  fileName,
  fileType,
}: {
  type: string;
  fileName: string;
  fileType: string;
}): Promise<GenerateUploadUrlResponse> => {
  try {
    const response = await api.post("/upload", {
      type,
      fileName,
      fileType,
    });

    const { message } = response.data;
    const { signedUrl, key, fileUrl } = response.data.data.data;

    return { message, signedUrl, key, fileUrl };
  } catch (error) {
    console.error("Generate upload URL error:", error);
    throw error;
  }
};

export const uploadFileToS3 = async (
  signedUrl: string,
  file: File,
  fileType: string,
): Promise<void> => {
  try {
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
  } catch (error) {
    console.error("Upload file to S3 error:", error);
    throw error;
  }
};
