export interface IDeal {
  _id: string;

  idempotentId: string;

  tenantId: string;
  leadId?: string;
  userId: string;

  name: string;

  value: number;
  probability: number;

  createdAt: string;
  updatedAt: string;
}
