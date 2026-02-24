import { api } from "@/api";
import { buildQueryParams } from "@/api/query-params";
import type { Deal, Lead, LeadActionHistory } from "@/types";

export type GetAllLeadsResponse = {
  message: string;
  leads: Lead[];
  totalCount: number;
};

export type GetLeadByIdResponse = {
  message: string;
  lead: Lead;
};

export type CreateLeadResponse = {
  message: string;
  lead: Lead;
};

export type UpdateLeadResponse = {
  message: string;
  lead: Lead;
};

export type DeleteLeadResponse = {
  message: string;
  id: string;
};

export type GetAllOrganizationsResponse = {
  message: string;
  organizations: { _id: string; name: string }[];
};

export type GetLeadActivityByLeadIdResponse = {
  message: string;
  activities: LeadActionHistory[];
};

export type ConvertLeadToDealResponse = {
  message: string;
  deal: Deal;
};

export const getAllLeads = async ({
  cursor,
  limit = 10,
  search,
}: {
  cursor?: string;
  limit?: number;
  search?: string;
}): Promise<GetAllLeadsResponse> => {
  try {
    const query = buildQueryParams({ cursor, limit, search });
    const response = await api.get(`/lead${query ? `?${query}` : ""}`);

    const { message } = response.data;
    const { leads, totalCount } = response.data.data;

    return { message, leads, totalCount };
  } catch (error) {
    console.error("Get all leads error:", error);
    throw error;
  }
};

export const getLeadById = async ({
  id,
}: {
  id: string;
}): Promise<GetLeadByIdResponse> => {
  try {
    const response = await api.get(`/lead/${id}`);

    const { message } = response.data;
    const { lead } = response.data.data;

    return { message, lead };
  } catch (error) {
    console.error("Get lead by ID error:", error);
    throw error;
  }
};

export const createLead = async ({
  idempotentId,
  orgId,
  orgName,
  firstName,
  lastName,
  email,
  mobile,
  gender,
  source,
}: {
  idempotentId: string;
  orgId: string;
  orgName: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  gender?: string;
  source?: string;
}): Promise<CreateLeadResponse> => {
  try {
    const response = await api.post("/lead", {
      idempotentId,
      orgId,
      orgName,
      firstName,
      lastName,
      email,
      mobile,
      gender,
      source,
    });

    const { message } = response.data;
    const { lead } = response.data.data;

    return { message, lead };
  } catch (error) {
    console.error("Create lead error:", error);
    throw error;
  }
};

export const updateLeadById = async ({
  id,
  orgId,
  orgName,
  firstName,
  lastName,
  email,
  mobile,
  gender,
  source,
  status,
}: {
  id: string;
  orgId?: string;
  orgName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  gender?: string;
  source?: string;
  status?: string;
}): Promise<UpdateLeadResponse> => {
  try {
    const response = await api.patch(`/lead/${id}`, {
      orgId,
      orgName,
      firstName,
      lastName,
      email,
      mobile,
      gender,
      source,
      status,
    });

    const { message } = response.data;
    const { updatedLead } = response.data.data;

    return { message, lead: updatedLead };
  } catch (error) {
    console.error("Update lead error:", error);
    throw error;
  }
};

export const deleteLeadById = async ({
  id,
}: {
  id: string;
}): Promise<DeleteLeadResponse> => {
  try {
    const response = await api.delete(`/lead/${id}`);

    const { message } = response.data;
    const { id: deletedId } = response.data.data;

    return { message, id: deletedId };
  } catch (error) {
    console.error("Delete lead error:", error);
    throw error;
  }
};

export const getLeadActivityByLeadId = async ({
  id,
}: {
  id: string;
}): Promise<GetLeadActivityByLeadIdResponse> => {
  try {
    const response = await api.get(`/lead/activity/${id}`);

    const { message } = response.data;
    const { activities } = response.data.data;

    return { message, activities };
  } catch (error) {
    console.error("Get lead activity by lead ID error:", error);
    throw error;
  }
};

export const convertLeadToDeal = async ({
  id,
  idempotentId,
  dealName,
  value,
  probability,
}: {
  id: string;
  idempotentId: string;
  dealName?: string;
  value?: number;
  probability?: number;
}): Promise<ConvertLeadToDealResponse> => {
  try {
    const response = await api.post(`/lead/${id}/convert`, {
      idempotentId,
      dealName,
      value,
      probability,
    });

    const { message } = response.data;
    const { deal } = response.data.data;

    return { message, deal };
  } catch (error) {
    console.error("Convert lead to deal error:", error);
    throw error;
  }
};

export const getAllOrganizations = async ({
  limit = 10,
  search,
}: {
  limit?: number;
  search?: string;
}): Promise<GetAllOrganizationsResponse> => {
  try {
    const query = buildQueryParams({ limit, search });
    const response = await api.get(`/lead/organizations${query ? `?${query}` : ""}`);

    const { message } = response.data;
    const { organizations } = response.data.data;

    return { message, organizations };
  } catch (error) {
    console.error("Get all organizations error:", error);
    throw error;
  }
};
