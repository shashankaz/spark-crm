export type Email = {
  _id: string;

  leadId: string;
  tenantId: string;
  userId: string;

  from: string;
  to: string;
  subject: string;
  bodyHtml: string;
  bodyText: string;
  status: "sent" | "failed" | "draft";
  sentAt?: string;

  createdAt: string;
  updatedAt: string;
};
