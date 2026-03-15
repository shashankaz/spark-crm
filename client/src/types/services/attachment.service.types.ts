import type { IAttachment } from "@/types/domain";

/**
 * API response types
 */

export type AttachmentsData = {
  attachments: IAttachment[];
  totalCount: number;
};

export type AttachmentData = {
  attachment: IAttachment;
};

export type UploadUrlData = {
  signedUrl: string;
  key: string;
  fileUrl: string;
};

/**
 * Request types
 */

export type GetAllAttachmentsByLeadIdRequest = {
  leadId: string;
  cursor?: string;
  limit?: number;
  search?: string;
};

export type CreateAttachmentForLeadRequest = {
  leadId: string;
  fileName: string;
  fileUrl: string;
  fileType?: string;
};

export type GenerateUploadUrlRequest = {
  type: string;
  fileName: string;
  fileType: string;
};

/**
 * Response types
 */

export type GetAttachmentsResponse = {
  message: string;
  attachments: IAttachment[];
  totalCount: number;
};

export type CreateAttachmentResponse = {
  message: string;
  attachment: IAttachment;
};

export type GenerateUploadUrlResponse = {
  message: string;
  signedUrl: string;
  key: string;
  fileUrl: string;
};
