import { Types } from "mongoose";

export interface CreateGroupInput {
  name: string;
  description?: string;
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
  leads?: Types.ObjectId[];
}

export interface UpdateGroupInput {
  id: Types.ObjectId;
  tenantId: Types.ObjectId;
  name?: string;
  description?: string;
  leads?: Types.ObjectId[];
}

export interface DeleteGroupInput {
  id: Types.ObjectId;
  tenantId: Types.ObjectId;
}

export interface FetchGroupsInput {
  tenantId: Types.ObjectId;
  userId?: Types.ObjectId;
}

export interface GetGroupByIdInput {
  id: Types.ObjectId;
  tenantId: Types.ObjectId;
}

export interface SendCampaignToGroupInput {
  tenantId: Types.ObjectId;
  groupId: Types.ObjectId;
  userId: Types.ObjectId;
  userName: string;
  subject: string;
  bodyHtml: string;
  bodyText?: string;
}
