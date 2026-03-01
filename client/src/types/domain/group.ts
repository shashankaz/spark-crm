import type { Lead } from "./lead";

export interface Group {
  _id: string;

  name: string;
  description?: string;

  tenantId: string;
  userId: string;

  leads: Lead[] | string[];

  createdAt: string;
  updatedAt: string;
}
