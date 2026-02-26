import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        tenantId: string;
        email: string;
        name: string;
        role: string;
      };
    }
  }
}
