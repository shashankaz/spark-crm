import { Request } from "express";
import { Types } from "mongoose";
import { UserDocument } from "./src/types/models/user.model.types";

declare global {
  namespace Express {
    interface Request {
      user: UserDocument;
      webhookTenantId?: Types.ObjectId;
    }
  }
}
