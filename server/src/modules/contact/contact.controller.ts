import { Request, Response } from "express";
import { Types } from "mongoose";
import { AppError } from "../../shared/app-error";
import { sendSuccess } from "../../shared/api-response";
import { asyncHandler } from "../../shared/async-handler";
import { validateEmailWithArcjet } from "../../utils/arcjet/validate-email";
import {
  fetchContactsService,
  fetchContactByIdService,
  createContactService,
  updateContactByIdService,
  toggleContactStarService,
  deleteContactByIdService,
  bulkDeleteContactsService,
} from "./services/contact.service";

export const getAllContacts = asyncHandler(
  async (req: Request, res: Response) => {
    const { tenantId, _id: userId, role } = req.user;
    if (!tenantId) {
      throw new AppError("Tenant ID is missing in user data", 400);
    }

    const cursor = req.query.cursor as Types.ObjectId | undefined;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search as string | undefined;
    const starred =
      req.query.starred === "true"
        ? true
        : req.query.starred === "false"
          ? false
          : undefined;

    const sortBy = req.query.sortBy as string | undefined;
    const sortOrder = req.query.sortOrder as "asc" | "desc" | undefined;

    const { contacts, totalCount } = await fetchContactsService({
      tenantId,
      userId,
      role,
      cursor,
      limit,
      search,
      starred,
      sortBy,
      sortOrder,
    });

    sendSuccess(res, 200, "Contacts retrieved successfully", {
      contacts,
      totalCount,
    });
  },
);

export const getContactById = asyncHandler(
  async (req: Request, res: Response) => {
    const { tenantId, _id: userId, role } = req.user;
    if (!tenantId) {
      throw new AppError("Tenant ID is missing in user data", 400);
    }

    const id = req.params.id as unknown as Types.ObjectId;
    if (!id) {
      throw new AppError("Contact ID is required", 400);
    }

    const contact = await fetchContactByIdService({
      id,
      tenantId,
      userId,
      role,
    });

    sendSuccess(res, 200, "Contact retrieved successfully", { contact });
  },
);

export const createContact = asyncHandler(
  async (req: Request, res: Response) => {
    const { tenantId, _id: userId } = req.user;
    if (!tenantId) {
      throw new AppError("Tenant ID is missing in user data", 400);
    }

    const {
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
    } = req.body;

    if (!firstName || !email) {
      throw new AppError("First name and email are required", 400);
    }

    const isDenied = await validateEmailWithArcjet({ req, email });
    if (isDenied) {
      throw new AppError("Invalid email address", 400);
    }

    const contact = await createContactService({
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
    });

    sendSuccess(res, 201, "Contact created successfully", { contact });
  },
);

export const updateContact = asyncHandler(
  async (req: Request, res: Response) => {
    const { tenantId } = req.user;
    if (!tenantId) {
      throw new AppError("Tenant ID is missing in user data", 400);
    }

    const id = req.params.id as unknown as Types.ObjectId;
    if (!id) {
      throw new AppError("Contact ID is required", 400);
    }

    const {
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
    } = req.body;

    if (email) {
      const isDenied = await validateEmailWithArcjet({ req, email });
      if (isDenied) {
        throw new AppError("Invalid email address", 400);
      }
    }

    const updatedContact = await updateContactByIdService({
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
    });

    sendSuccess(res, 200, "Contact updated successfully", { updatedContact });
  },
);

export const toggleStarContact = asyncHandler(
  async (req: Request, res: Response) => {
    const { tenantId } = req.user;
    if (!tenantId) {
      throw new AppError("Tenant ID is missing in user data", 400);
    }

    const id = req.params.id as unknown as Types.ObjectId;
    if (!id) {
      throw new AppError("Contact ID is required", 400);
    }

    const contact = await toggleContactStarService({ id, tenantId });

    sendSuccess(res, 200, "Contact star toggled successfully", { contact });
  },
);

export const deleteContact = asyncHandler(
  async (req: Request, res: Response) => {
    const { tenantId } = req.user;
    if (!tenantId) {
      throw new AppError("Tenant ID is missing in user data", 400);
    }

    const id = req.params.id as unknown as Types.ObjectId;
    if (!id) {
      throw new AppError("Contact ID is required", 400);
    }

    await deleteContactByIdService({ id, tenantId });

    sendSuccess(res, 200, "Contact deleted successfully", { id });
  },
);

export const bulkDeleteContacts = asyncHandler(
  async (req: Request, res: Response) => {
    const { tenantId } = req.user;
    if (!tenantId) {
      throw new AppError("Tenant ID is missing in user data", 400);
    }

    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new AppError("ids must be a non-empty array", 400);
    }

    const result = await bulkDeleteContactsService({ ids, tenantId });

    sendSuccess(
      res,
      200,
      `${result.deletedCount} contact(s) deleted successfully`,
      {
        deletedCount: result.deletedCount,
      },
    );
  },
);
