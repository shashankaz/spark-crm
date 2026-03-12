import { Request, Response } from "express";
import { Types } from "mongoose";
import {
  fetchEmailsByLeadService,
  sendEmailForLeadService,
} from "./services/email.service";
import { AppError } from "../../shared/app-error";
import { sendSuccess } from "../../shared/api-response";
import { asyncHandler } from "../../shared/async-handler";

export const getAllEmailsByLeadId = asyncHandler(
  async (req: Request, res: Response) => {
    const leadId = req.params.leadId as unknown as Types.ObjectId;
    if (!leadId) {
      throw new AppError("Lead ID is required", 400);
    }

    const cursor = req.query.cursor as string | undefined;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search as string | undefined;

    const { emails, totalCount } = await fetchEmailsByLeadService({
      leadId,
      cursor,
      limit,
      search,
    });

    sendSuccess(res, 200, "Emails retrieved successfully", {
      emails,
      totalCount,
    });
  },
);

export const sendEmailForLead = asyncHandler(
  async (req: Request, res: Response) => {
    const leadId = req.params.leadId as unknown as Types.ObjectId;
    if (!leadId) {
      throw new AppError("Lead ID is required", 400);
    }

    const { tenantId, _id: userId, firstName: userName } = req.user;
    if (!tenantId) {
      throw new AppError("Tenant ID is missing in user data", 400);
    }

    const { to, subject, bodyHtml, bodyText } = req.body;

    if (!to) throw new AppError("Recipient email (to) is required", 400);
    if (!subject) throw new AppError("Subject is required", 400);
    if (!bodyHtml) throw new AppError("Email body is required", 400);

    const email = await sendEmailForLeadService({
      leadId,
      userId,
      userName,
      to,
      subject,
      bodyHtml,
      bodyText: bodyText || bodyHtml.replace(/<[^>]+>/g, ""),
    });

    sendSuccess(res, 201, "Email sent successfully", { email });
  },
);
