export type LeadActionHistory = {
  _id: string;

  tenantId: string;
  leadId: string;

  actionType: string;
  message: string;

  userId: string;
  userName: string;

  createdAt: Date;
};
