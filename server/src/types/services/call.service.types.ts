export interface FetchCallsByLeadInput {
  leadId: string;
  cursor?: string;
  limit: number;
  search?: string;
}

export interface CreateCallForLeadInput {
  tenantId: string;
  leadId: string;
  userId: string;
  userName: string;
  type: string;
  from: string;
  status: string;
  duration?: number;
}

export interface CallResponse {
  _id: string;
  tenantId: string;
  leadId: string;
  type: string;
  to: string;
  from: string;
  status: string;
  duration: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FetchCallsByLeadResponse {
  calls: CallResponse[];
  totalCount: number;
}
