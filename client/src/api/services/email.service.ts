import { api } from "@/api";
import { withApiHandler } from "@/api/api-handler";
import { buildQueryParams } from "@/api/query-params";
import type { ApiResponse } from "@/api/api-response";
import type {
  EmailData,
  EmailsData,
  GetAllEmailsByLeadIdRequest,
  GetEmailsResponse,
  SendEmailForLeadRequest,
  SendEmailResponse,
} from "@/types/services";

export const getAllEmailsByLeadId = async (
  params: GetAllEmailsByLeadIdRequest,
): Promise<GetEmailsResponse> =>
  withApiHandler(async () => {
    const { leadId, cursor, limit = 10, search } = params;
    const query = buildQueryParams({ cursor, limit, search });
    const response = await api.get<ApiResponse<EmailsData>>(
      `/email/${leadId}${query ? `?${query}` : ""}`,
    );

    const { message, data } = response.data;

    return {
      message,
      emails: data.emails,
      totalCount: data.totalCount,
    };
  });

export const sendEmailForLead = async (
  params: SendEmailForLeadRequest,
): Promise<SendEmailResponse> =>
  withApiHandler(async () => {
    const { leadId, to, subject, bodyHtml, bodyText, from } = params;
    const response = await api.post<ApiResponse<EmailData>>(
      `/email/${leadId}`,
      {
        to,
        subject,
        bodyHtml,
        bodyText,
        from,
      },
    );

    const { message, data } = response.data;

    return {
      message,
      email: data.email,
    };
  });
