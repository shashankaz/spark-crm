export interface IComment {
  _id: string;

  tenantId: string;
  leadId: string;

  comment: string;

  createdAt: string;
  updatedAt: string;
}
