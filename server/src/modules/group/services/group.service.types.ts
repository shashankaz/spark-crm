import { Types } from "mongoose";

export interface ICreateGroupInput {
  name: string;
  description?: string;
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
  leads: Types.ObjectId[];
}

export interface IUpdateGroupInput {
  id: Types.ObjectId;
  tenantId: Types.ObjectId;
  name?: string;
  description?: string;
  leads?: Types.ObjectId[];
}

export interface IDeleteGroupInput {
  id: Types.ObjectId;
  tenantId: Types.ObjectId;
}

export interface IFetchGroupsInput {
  tenantId: Types.ObjectId;
  userId?: Types.ObjectId;
}

export interface IGetGroupByIdInput {
  id: Types.ObjectId;
  tenantId: Types.ObjectId;
}

export interface ISendCampaignToGroupInput {
  tenantId: Types.ObjectId;
  groupId: Types.ObjectId;
  userId: Types.ObjectId;
  userName: string;
  subject: string;
  bodyHtml: string;
  bodyText?: string;
}
