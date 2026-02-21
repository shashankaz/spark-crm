export type Organization = {
  _id: string;

  idempotentId: string;

  tenantId: string;
  userId: string;

  name: string;

  industry?: string;
  size?: string;
  country?: string;

  email?: string;
  mobile?: string;
  website?: string;

  contactName?: string;
  contactEmail?: string;
  contactMobile?: string;

  createdAt: Date;
  updatedAt: Date;
};
