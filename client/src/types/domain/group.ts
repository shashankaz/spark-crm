export interface Group {
  _id: string;

  name: string;
  description?: string;

  tenantId: string;
  userId: string;

  leadCount: number;

  createdAt: string;
  updatedAt: string;
}
