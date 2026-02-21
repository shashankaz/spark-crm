export type User = {
  _id: string;

  firstName: string;
  lastName?: string;

  email: string;
  mobile?: string;

  password: string;

  role: "user" | "admin" | "super_admin";

  tenantId: string;

  createdAt: Date;
  updatedAt: Date;
};
