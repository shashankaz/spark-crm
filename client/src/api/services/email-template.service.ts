import { api } from "@/api";
import { withApiHandler } from "@/api/api-handler";
import { buildQueryParams } from "@/api/query-params";
import type { ApiResponse } from "@/api/api-response";
import type {
  CreateEmailTemplateRequest,
  CreateEmailTemplateResponse,
  DeleteEmailTemplateRequest,
  DeleteEmailTemplateResponse,
  EmailTemplateData,
  EmailTemplatesData,
  GetAllEmailTemplatesRequest,
  GetAllEmailTemplatesResponse,
  GetEmailTemplateRequest,
  GetEmailTemplateResponse,
  UpdateEmailTemplateRequest,
  UpdateEmailTemplateResponse,
} from "@/types/services";

export const getAllEmailTemplates = async (
  params: GetAllEmailTemplatesRequest,
): Promise<GetAllEmailTemplatesResponse> =>
  withApiHandler(async () => {
    const query = buildQueryParams(params);
    const response = await api.get<ApiResponse<EmailTemplatesData>>(
      `/email-template${query ? `?${query}` : ""}`,
    );

    const { message, data } = response.data;

    return { message, templates: data.templates };
  });

export const getEmailTemplate = async ({
  id,
}: GetEmailTemplateRequest): Promise<GetEmailTemplateResponse> =>
  withApiHandler(async () => {
    const response = await api.get<ApiResponse<EmailTemplateData>>(
      `/email-template/${id}`,
    );

    const { message, data } = response.data;

    return { message, template: data.template };
  });

export const createEmailTemplate = async (
  payload: CreateEmailTemplateRequest,
): Promise<CreateEmailTemplateResponse> =>
  withApiHandler(async () => {
    const response = await api.post<ApiResponse<EmailTemplateData>>(
      "/email-template",
      payload,
    );

    const { message, data } = response.data;

    return { message, template: data.template };
  });

export const updateEmailTemplate = async ({
  id,
  ...data
}: UpdateEmailTemplateRequest): Promise<UpdateEmailTemplateResponse> =>
  withApiHandler(async () => {
    const response = await api.patch<ApiResponse<EmailTemplateData>>(
      `/email-template/${id}`,
      data,
    );

    const { message, data: updatedData } = response.data;

    return { message, template: updatedData.template };
  });

export const deleteEmailTemplate = async ({
  id,
}: DeleteEmailTemplateRequest): Promise<DeleteEmailTemplateResponse> =>
  withApiHandler(async () => {
    const response = await api.delete<ApiResponse<void>>(
      `/email-template/${id}`,
    );

    return { message: response.data.message };
  });
