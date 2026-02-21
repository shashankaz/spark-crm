export type Call = {
  _id: string;

  tenantId: string;
  leadId: string;

  type: "inbound" | "outbound";

  to: string;
  from: string;

  status: "completed" | "missed" | "cancelled";

  duration: number;

  createdAt: string;
};
