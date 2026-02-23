import { api } from "@/api";
import type { Organization } from "@/types";

export type GetAllOrganizationsResponse = {
  message: string;
  organizations: Organization[];
  totalCount: number;
};

export type GetOrganizationByIdResponse = {
  message: string;
  organization: Organization;
};

export type CreateOrganizationResponse = {
  message: string;
  organization: Organization;
};

export type UpdateOrganizationResponse = {
  message: string;
  updatedOrganization: Organization;
};

export type DeleteOrganizationResponse = {
  message: string;
  id: string;
};

export const getAllOrganizations = async ({
  cursor,
  limit = 10,
  search,
}: {
  cursor?: string;
  limit?: number;
  search?: string;
}): Promise<GetAllOrganizationsResponse> => {
  try {
    const response = await api.get("/organization", {
      params: { cursor, limit, search },
    });

    const { message } = response.data;
    const { organizations, totalCount } = response.data.data;

    return { message, organizations, totalCount };
  } catch (error) {
    console.error("Get all organizations error:", error);
    throw error;
  }
};

export const getOrganizationById = async ({
  id,
}: {
  id: string;
}): Promise<GetOrganizationByIdResponse> => {
  try {
    const response = await api.get(`/organization/${id}`);

    const { message } = response.data;
    const { organization } = response.data.data;

    return { message, organization };
  } catch (error) {
    console.error("Get organization by ID error:", error);
    throw error;
  }
};

export const createOrganization = async ({
  idempotentId,
  name,
  industry,
  size,
  country,
  email,
  mobile,
  website,
  contactName,
  contactEmail,
  contactMobile,
}: {
  idempotentId: string;
  name: string;
  industry?: string;
  size?: string;
  country?: string;
  email?: string;
  mobile?: string;
  website?: string;
  contactName?: string;
  contactEmail?: string;
  contactMobile?: string;
}): Promise<CreateOrganizationResponse> => {
  try {
    const response = await api.post("/organization", {
      idempotentId,
      name,
      industry,
      size,
      country,
      email,
      mobile,
      website,
      contactName,
      contactEmail,
      contactMobile,
    });

    const { message } = response.data;
    const { organization } = response.data.data;

    return { message, organization };
  } catch (error) {
    console.error("Create organization error:", error);
    throw error;
  }
};

export const updateOrganizationById = async ({
  id,
  name,
  industry,
  size,
  country,
  email,
  mobile,
  website,
  contactName,
  contactEmail,
  contactMobile,
}: {
  id: string;
  name?: string;
  industry?: string;
  size?: string;
  country?: string;
  email?: string;
  mobile?: string;
  website?: string;
  contactName?: string;
  contactEmail?: string;
  contactMobile?: string;
}): Promise<UpdateOrganizationResponse> => {
  try {
    const response = await api.patch(`/organization/${id}`, {
      name,
      industry,
      size,
      country,
      email,
      mobile,
      website,
      contactName,
      contactEmail,
      contactMobile,
    });

    const { message } = response.data;
    const { updatedOrganization } = response.data.data;

    return { message, updatedOrganization };
  } catch (error) {
    console.error("Update organization error:", error);
    throw error;
  }
};

export const deleteOrganizationById = async ({
  id,
}: {
  id: string;
}): Promise<DeleteOrganizationResponse> => {
  try {
    const response = await api.delete(`/organization/${id}`);

    const { message } = response.data;
    const { id: deletedId } = response.data.data;

    return { message, id: deletedId };
  } catch (error) {
    console.error("Delete organization error:", error);
    throw error;
  }
};
