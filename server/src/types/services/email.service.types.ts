import { Types } from "mongoose";

export interface FetchEmailsByLeadInput {
  leadId: string | Types.ObjectId;
  cursor?: string;
  limit: number;
  search?: string;
}

export interface SendEmailForLeadInput {
  leadId: string | Types.ObjectId;
  userId: Types.ObjectId;
  userName: string;
  to: string;
  subject: string;
  bodyHtml: string;
  bodyText: string;
}
