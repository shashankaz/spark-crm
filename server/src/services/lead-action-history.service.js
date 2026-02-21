import { LeadActionHistory } from "../models/lead-action-history.model.js";

export const createLeadActionHistoryService = async ({
  tenantId,
  leadId,
  actionType,
  message,
  userId,
  userName,
}) => {
  return await LeadActionHistory.create({
    tenantId,
    leadId,
    actionType,
    message,
    userId,
    userName,
  });
};
