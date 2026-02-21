export type Deal = {
  _id: string;

  idempotentId: string;

  tenantId: string;
  leadId?: string;
  userId: string;

  name: string;

  value: number;
  probability: number;

  createdAt: Date;
  updatedAt: Date;
};
