import type { Attachment } from "@/types/domain";

export type AttachmentsData = {
  attachments: Attachment[];
  totalCount: number;
};

export type AttachmentData = {
  attachment: Attachment;
};

export type UploadUrlData = {
  signedUrl: string;
  key: string;
  fileUrl: string;
};

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
