export interface FetchCommentsByLeadInput {
  leadId: string;
  cursor?: string;
  limit: number;
  search?: string;
}

export interface CreateCommentForLeadInput {
  tenantId: string;
  leadId: string;
  userId: string;
  userName: string;
  comment: string;
}
