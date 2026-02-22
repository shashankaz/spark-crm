export type Lead = {
  _id: string;

  idempotentId: string;

  tenantId: string;
  orgId?: string;
  orgName?: string;
  dealId?: string;

  userId: string;

  firstName: string;
  lastName?: string;

  email: string;
  mobile: string;

  gender: string;

  source?: string;

  score: number;

  status: "new" | "contacted" | "qualified" | "converted" | "lost";

  createdAt: string;
  updatedAt: string;
};
