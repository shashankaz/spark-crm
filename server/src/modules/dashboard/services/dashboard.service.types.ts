import { Types } from "mongoose";
import { UserRole } from "../../user/models/user.model.types";

export interface FetchDashboardStatsInput {
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
  role: UserRole;
}
