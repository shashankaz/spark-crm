import type { IGroup } from "@/types/domain";

export type GroupsData = {
  groups: IGroup[];
  totalCount: number;
};

export type GroupData = {
  group: IGroup;
};

export type CampaignResult = {
  total: number;
  successful: number;
  failed: number;
};

export type GetGroupRequest = {
  id: string;
};

export type CreateGroupRequest = {
  name: string;
  description?: string;
  leads?: string[];
};

export type UpdateGroupRequest = {
  id: string;
  name?: string;
  description?: string;
  leads?: string[];
};

export type SendCampaignRequest = {
  groupId: string;
  subject: string;
  bodyHtml: string;
  bodyText?: string;
  from?: string;
};

export type GetGroupsRequest = {
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export type GetGroupsResponse = {
  message: string;
  groups: IGroup[];
  totalCount: number;
};

export type GetGroupResponse = {
  message: string;
  group: IGroup;
};

export type DeleteGroupRequest = {
  id: string;
};

export type DeleteGroupResponse = {
  message: string;
};

export type CampaignResponse = {
  message: string;
  total: number;
  successful: number;
  failed: number;
};
