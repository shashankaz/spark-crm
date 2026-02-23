export type ActionType =
  | "lead_created"
  | "lead_updated"
  | "lead_deleted"
  | "lead_contacted"
  | "lead_qualified"
  | "lead_converted"
  | "lead_lost"
  | "lead_call_logged"
  | "lead_commented"
  | "lead_score_updated"
  | "lead_assigned";

export type LeadActionHistory = {
  _id: string;

  tenantId: string;
  leadId: string;

  actionType: ActionType;
  message: string;

  userId: string;
  userName: string;

  createdAt: string;
};
