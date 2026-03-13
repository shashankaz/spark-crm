import { Types } from "mongoose";
import { formatDate } from "date-fns";
import { Contact } from "../models/contact.model";
import { AppError } from "../../../shared/app-error";
import {
  IFetchContactsInput,
  IFetchContactByIdInput,
  ICreateContactInput,
  IUpdateContactByIdInput,
  IToggleContactStarInput,
  IDeleteContactByIdInput,
  IBulkDeleteContactsInput,
} from "./contact.service.types";
import { IContactDocument } from "../models/contact.model.types";

const CONTACT_SORT_FIELDS: Record<string, string> = {
  firstName: "firstName",
  lastName: "lastName",
  email: "email",
  jobTitle: "jobTitle",
  orgName: "orgName",
  role: "role",
  _id: "_id",
};

export const fetchContactsService = async ({
  tenantId,
  userId,
  role,
  cursor,
  limit,
  search,
  starred,
  sortBy = "_id",
  sortOrder = "desc",
}: IFetchContactsInput) => {
  const resolvedSortField = CONTACT_SORT_FIELDS[sortBy] ?? "_id";
  const resolvedSortDir = sortOrder === "asc" ? 1 : -1;
  const sortStage: Record<string, 1 | -1> = {
    [resolvedSortField]: resolvedSortDir,
  };

  const searchQuery: any = { tenantId };

  if (cursor) {
    searchQuery._id = { $lt: cursor };
  }

  if (search) {
    const searchRegex = new RegExp(search.trim(), "i");

    searchQuery.$or = [
      { firstName: { $regex: searchRegex } },
      { lastName: { $regex: searchRegex } },
      { email: { $regex: searchRegex } },
      { orgName: { $regex: searchRegex } },
    ];
  }

  if (role !== "admin") {
    searchQuery.userId = userId;
  }

  if (typeof starred === "boolean") {
    searchQuery.starred = starred;
  }

  const [totalCount, contacts] = await Promise.all([
    Contact.countDocuments(searchQuery).exec(),
    Contact.find(searchQuery).sort(sortStage).limit(limit).exec(),
  ]);

  const formattedContact = contacts.map((contact: IContactDocument) => ({
    _id: contact._id,
    firstName: contact.firstName,
    lastName: contact.lastName ?? undefined,
    email: contact.email,
    phone: contact.phone ?? undefined,
    jobTitle: contact.jobTitle ?? undefined,
    department: contact.department ?? undefined,
    orgName: contact.orgName ?? undefined,
    orgId: contact.orgId ?? undefined,
    starred: contact.starred ?? false,
    createdAt: formatDate(contact.createdAt, "dd/MM/yyyy"),
  }));

  return {
    contacts: formattedContact,
    totalCount,
  };
};

export const fetchContactByIdService = async ({
  id,
  tenantId,
  userId,
  role,
}: IFetchContactByIdInput) => {
  const contact = await Contact.findOne({ _id: id, tenantId }).exec();
  if (!contact) {
    throw new AppError("Contact not found", 404);
  }

  if (role !== "admin" && String(contact.userId) !== String(userId)) {
    throw new AppError("Unauthorized", 403);
  }

  return contact;
};

export const createContactService = async ({
  tenantId,
  userId,
  orgId,
  orgName,
  firstName,
  lastName,
  email,
  phone,
  jobTitle,
  department,
  linkedinUrl,
  website,
}: ICreateContactInput) => {
  const existing = await Contact.findOne({
    tenantId,
    email: email.toLowerCase(),
  }).exec();
  if (existing) {
    throw new AppError("A contact with this email already exists", 409);
  }

  const contact = new Contact({
    tenantId,
    userId,
    orgId: orgId || undefined,
    orgName: orgName || undefined,
    firstName,
    lastName: lastName || undefined,
    email,
    phone: phone || undefined,
    jobTitle: jobTitle || undefined,
    department: department || undefined,
    linkedinUrl: linkedinUrl || undefined,
    website: website || undefined,
    starred: false,
  });

  return await contact.save();
};

export const updateContactByIdService = async ({
  id,
  tenantId,
  orgId,
  orgName,
  firstName,
  lastName,
  email,
  phone,
  jobTitle,
  department,
  linkedinUrl,
  website,
}: IUpdateContactByIdInput) => {
  const contact = await Contact.findOne({ _id: id, tenantId }).exec();
  if (!contact) {
    throw new AppError("Contact not found", 404);
  }

  if (email && email !== contact.email) {
    const duplicate = await Contact.findOne({
      tenantId,
      email: email.toLowerCase(),
      _id: { $ne: id },
    }).exec();
    if (duplicate) {
      throw new AppError("Another contact with this email already exists", 409);
    }
  }

  if (orgId) contact.orgId = orgId as Types.ObjectId;
  if (orgName) contact.orgName = orgName;
  if (firstName) contact.firstName = firstName;
  if (lastName) contact.lastName = lastName;
  if (email) contact.email = email;
  if (phone) contact.phone = phone;
  if (jobTitle) contact.jobTitle = jobTitle;
  if (department) contact.department = department;
  if (linkedinUrl) contact.linkedinUrl = linkedinUrl;
  if (website) contact.website = website;

  return await contact.save();
};

export const toggleContactStarService = async ({
  id,
  tenantId,
}: IToggleContactStarInput) => {
  const contact = await Contact.findOne({ _id: id, tenantId }).exec();
  if (!contact) {
    throw new AppError("Contact not found", 404);
  }

  contact.starred = !contact.starred;

  return await contact.save();
};

export const deleteContactByIdService = async ({
  id,
  tenantId,
}: IDeleteContactByIdInput) => {
  const contact = await Contact.findOneAndDelete({ _id: id, tenantId }).exec();
  if (!contact) {
    throw new AppError("Contact not found", 404);
  }

  return contact;
};

export const bulkDeleteContactsService = async ({
  ids,
  tenantId,
}: IBulkDeleteContactsInput) => {
  const result = await Contact.deleteMany({
    _id: { $in: ids },
    tenantId,
  }).exec();

  return { deletedCount: result.deletedCount };
};
