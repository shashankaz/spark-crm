export type Comment = {
  _id: string;

  tenantId: string;
  leadId: string;

  comment: string;

  createdAt: Date;
  updatedAt: Date;
};
