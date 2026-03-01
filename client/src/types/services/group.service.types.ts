import type { Group } from "@/types/domain";

export type GroupsData = {
  groups: Group[];
};

export type GroupData = {
  group: Group;
};

export type CampaignResult = {
  total: number;
  successful: number;
  failed: number;
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

export type GetGroupsResponse = {
  message: string;
  groups: Group[];
};

export type GetGroupResponse = {
  message: string;
  group: Group;
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
