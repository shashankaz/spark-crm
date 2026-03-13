export interface IContact {
  _id: string;
  tenantId: string;
  userId: string;

  orgId?: string;
  orgName?: string;

  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  department?: string;

  linkedinUrl?: string;
  website?: string;
  starred: boolean;

  createdAt: string;
  updatedAt: string;
}
