import { Types } from "mongoose";

export interface IFetchEmailsByLeadInput {
  leadId: string | Types.ObjectId;
  cursor?: string;
  limit: number;
  search?: string;
}

export interface ISendEmailForLeadInput {
  leadId: string | Types.ObjectId;
  userId: Types.ObjectId;
  userName: string;
  to: string;
  subject: string;
  bodyHtml: string;
  bodyText: string;
}
