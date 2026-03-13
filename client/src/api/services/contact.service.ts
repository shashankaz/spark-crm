import { api } from "@/api";
import { withApiHandler } from "@/api/api-handler";
import { buildQueryParams } from "@/api/query-params";
import type { ApiResponse } from "@/api/api-response";
import type {
  ContactsData,
  ContactData,
  UpdatedContactData,
  DeletedContactData,
  BulkDeleteContactsData,
  GetAllContactsRequest,
  GetAllContactsResponse,
  GetContactByIdRequest,
  GetContactByIdResponse,
  CreateContactRequest,
  CreateContactResponse,
  UpdateContactByIdRequest,
  UpdateContactResponse,
  ToggleContactStarRequest,
  ToggleContactStarResponse,
  DeleteContactByIdRequest,
  DeleteContactResponse,
  BulkDeleteContactsRequest,
  BulkDeleteContactsResponse,
} from "@/types/services";

export const getAllContacts = async (
  params: GetAllContactsRequest,
): Promise<GetAllContactsResponse> =>
  withApiHandler(async () => {
    const { cursor, limit = 10, search, starred, sortBy, sortOrder } = params;

    const query = buildQueryParams({
      cursor,
      limit,
      search,
      starred: starred !== undefined ? String(starred) : undefined,
      sortBy,
      sortOrder,
    });

    const response = await api.get<ApiResponse<ContactsData>>(
      `/contact${query ? `?${query}` : ""}`,
    );

    const { message, data } = response.data;

    return {
      message,
      contacts: (data as ContactsData).contacts,
      totalCount: (data as ContactsData).totalCount,
    };
  });

export const getContactById = async (
  params: GetContactByIdRequest,
): Promise<GetContactByIdResponse> =>
  withApiHandler(async () => {
    const { id } = params;
    const response = await api.get<ApiResponse<ContactData>>(`/contact/${id}`);

    const { message, data } = response.data;

    return { message, contact: (data as ContactData).contact };
  });

export const createContact = async (
  params: CreateContactRequest,
): Promise<CreateContactResponse> =>
  withApiHandler(async () => {
    const response = await api.post<ApiResponse<ContactData>>(
      "/contact",
      params,
    );

    const { message, data } = response.data;

    return { message, contact: (data as ContactData).contact };
  });

export const updateContactById = async (
  params: UpdateContactByIdRequest,
): Promise<UpdateContactResponse> =>
  withApiHandler(async () => {
    const { id, ...body } = params;
    const response = await api.patch<ApiResponse<UpdatedContactData>>(
      `/contact/${id}`,
      body,
    );

    const { message, data } = response.data;

    return {
      message,
      updatedContact: (data as UpdatedContactData).updatedContact,
    };
  });

export const toggleContactStar = async (
  params: ToggleContactStarRequest,
): Promise<ToggleContactStarResponse> =>
  withApiHandler(async () => {
    const { id } = params;
    const response = await api.patch<ApiResponse<ContactData>>(
      `/contact/${id}/star`,
    );

    const { message, data } = response.data;

    return { message, contact: (data as ContactData).contact };
  });

export const deleteContactById = async (
  params: DeleteContactByIdRequest,
): Promise<DeleteContactResponse> =>
  withApiHandler(async () => {
    const { id } = params;
    const response = await api.delete<ApiResponse<DeletedContactData>>(
      `/contact/${id}`,
    );

    const { message, data } = response.data;

    return { message, id: (data as DeletedContactData).id };
  });

export const bulkDeleteContacts = async (
  params: BulkDeleteContactsRequest,
): Promise<BulkDeleteContactsResponse> =>
  withApiHandler(async () => {
    const response = await api.post<ApiResponse<BulkDeleteContactsData>>(
      "/contact/bulk-delete",
      params,
    );

    const { message, data } = response.data;

    return {
      message,
      deletedCount: (data as BulkDeleteContactsData).deletedCount,
    };
  });
