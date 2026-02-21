export type Tenant = {
  _id: string;

  name: string;

  gstNumber?: string;
  panNumber?: string;

  email: string;
  mobile: string;

  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };

  logoUrl?: string;

  plan: "Free" | "Basic" | "Pro" | "Enterprise";

  isDeleted: boolean;
  deletedAt?: Date;

  createdAt: string;
  updatedAt: string;
};
