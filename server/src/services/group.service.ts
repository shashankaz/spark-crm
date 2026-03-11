import { Types } from "mongoose";
import { formatDate } from "date-fns/format";
import { Group } from "../models/group.model";
import { AppError } from "../shared/app-error";
import { sendEmailForLeadService } from "./lead-email.service";
import {
  CreateGroupInput,
  DeleteGroupInput,
  FetchGroupsInput,
  GetGroupByIdInput,
  SendCampaignToGroupInput,
  UpdateGroupInput,
} from "../types/services/group.service.types";
import { LeadDocument } from "../types/models/lead.model.types";

export const createGroupService = async ({
  name,
  description,
  tenantId,
  userId,
  leads,
}: CreateGroupInput) => {
  const group = await Group.create({
    name,
    description: description || undefined,
    tenantId,
    userId,
    leads: leads ? leads.map((l) => new Types.ObjectId(l)) : [],
  });

  return group;
};

export const fetchGroupsService = async ({
  tenantId,
  userId,
}: FetchGroupsInput) => {
  const query: any = { tenantId, userId };

  const [totalCount, groups] = await Promise.all([
    Group.countDocuments(query).exec(),
    Group.find(query).sort({ _id: -1 }).exec(),
  ]);

  const formattedGroups = groups.map((group) => ({
    _id: group._id,
    name: group.name,
    description: group.description ?? undefined,
    leadCount: group.leads.length,
    updatedAt: formatDate(group.updatedAt, "dd/MM/yyyy"),
  }));

  return { groups: formattedGroups, totalCount };
};

export const getGroupByIdService = async ({
  id,
  tenantId,
}: GetGroupByIdInput) => {
  const group = await Group.findOne({ _id: id, tenantId })
    .populate("leads")
    .exec();

  if (!group) {
    throw new AppError("Group not found", 404);
  }

  return group;
};

export const updateGroupService = async ({
  id,
  tenantId,
  name,
  description,
  leads,
}: UpdateGroupInput) => {
  const group = await Group.findOne({ _id: id, tenantId });
  if (!group) {
    throw new AppError("Group not found", 404);
  }

  if (name) group.name = name;
  if (description) group.description = description;
  if (leads) group.leads = leads.map((l) => new Types.ObjectId(l));

  return await group.save();
};

export const deleteGroupService = async ({
  id,
  tenantId,
}: DeleteGroupInput) => {
  const group = await Group.findOneAndDelete({ _id: id, tenantId });
  if (!group) {
    throw new AppError("Group not found", 404);
  }

  return group;
};

export const sendCampaignToGroupService = async ({
  tenantId,
  groupId,
  userId,
  userName,
  subject,
  bodyHtml,
  bodyText,
}: SendCampaignToGroupInput) => {
  const group = await getGroupByIdService({ id: groupId, tenantId });
  const leads = group.leads as unknown as LeadDocument[];

  if (!leads || leads.length === 0) {
    throw new AppError("No leads in this group to send emails to.", 400);
  }

  const results = await Promise.allSettled(
    leads.map(async (lead) => {
      return sendEmailForLeadService({
        leadId: lead._id,
        userId: userId,
        userName: userName,
        to: lead.email,
        subject,
        bodyHtml,
        bodyText: bodyText || bodyHtml.replace(/<[^>]+>/g, ""),
      });
    }),
  );

  const successful = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;

  return {
    total: leads.length,
    successful,
    failed,
  };
};
