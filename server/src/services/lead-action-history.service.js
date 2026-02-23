import { LeadActionHistory } from "../models/lead-action-history.model.js";
import { actionTypes } from "../utils/lead-action-type.js";

export const createLeadActionHistoryService = async ({
  leadId,
  actionType,
  message,
  userId,
  userName,
}) => {
  if (!actionTypes.includes(actionType)) {
    throw new Error(`Invalid action type: ${actionType}`);
  }

  return await LeadActionHistory.create({
    leadId,
    actionType,
    message,
    userId,
    userName,
  });
};
