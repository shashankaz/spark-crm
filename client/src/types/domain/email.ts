export type Email = {
  _id: string;

  leadId: string;

  to: string;
  subject: string;
  bodyHtml: string;
  bodyText: string;
  status: "sent" | "failed" | "draft";

  createdAt: string;
  updatedAt: string;
};
