import { LeadActionHistory } from "../models/lead-action-history.model";
import { actionTypes } from "../utils/lead-action-type";
import { CreateLeadActionHistoryInput } from "../types/services/lead-action-history.service.types";

export const createLeadActionHistoryService = async ({
  leadId,
  actionType,
  message,
  userId,
  userName,
}: CreateLeadActionHistoryInput) => {
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
