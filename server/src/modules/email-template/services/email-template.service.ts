import { EmailTemplate } from "../models/email-template.model";
import { AppError } from "../../../shared/app-error";
import {
  CreateEmailTemplateInput,
  DeleteEmailTemplateInput,
  FetchEmailTemplatesInput,
  GetEmailTemplateByIdInput,
  UpdateEmailTemplateInput,
} from "./email-template.service.types";

export const fetchEmailTemplatesService = async ({
  tenantId,
  userId,
  search,
  tag,
}: FetchEmailTemplatesInput) => {
  const query: any = { tenantId, userId };

  if (tag) {
    query.tags = tag;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { subject: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } },
    ];
  }

  const templates = await EmailTemplate.find(query)
    .sort({ createdAt: -1 })
    .exec();

  return templates;
};

export const getEmailTemplateByIdService = async ({
  id,
  tenantId,
}: GetEmailTemplateByIdInput) => {
  const template = await EmailTemplate.findOne({ _id: id, tenantId }).exec();

  if (!template) {
    throw new AppError("Email template not found", 404);
  }

  return template;
};

export const createEmailTemplateService = async ({
  name,
  subject,
  bodyHtml,
  tags,
  tenantId,
  userId,
}: CreateEmailTemplateInput) => {
  const template = new EmailTemplate({
    name,
    subject,
    bodyHtml,
    tags: tags ?? [],
    tenantId,
    userId,
  });

  return await template.save();
};

export const updateEmailTemplateService = async ({
  id,
  tenantId,
  userId,
  name,
  subject,
  bodyHtml,
  tags,
}: UpdateEmailTemplateInput) => {
  const template = await EmailTemplate.findOne({
    _id: id,
    tenantId,
    userId,
  }).exec();

  if (!template) {
    throw new AppError("Email template not found", 404);
  }

  if (name) template.name = name;
  if (subject) template.subject = subject;
  if (bodyHtml) template.bodyHtml = bodyHtml;
  if (tags) template.tags = tags;

  return await template.save();
};

export const deleteEmailTemplateService = async ({
  id,
  tenantId,
  userId,
}: DeleteEmailTemplateInput) => {
  const template = await EmailTemplate.findOneAndDelete({
    _id: id,
    tenantId,
    userId,
  }).exec();

  if (!template) {
    throw new AppError("Email template not found", 404);
  }

  return template;
};
