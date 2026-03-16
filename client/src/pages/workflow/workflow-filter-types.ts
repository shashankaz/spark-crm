export type WorkflowEntityFilter = "all" | "lead" | "deal" | "organization";
export type WorkflowEventFilter =
  | "all"
  | "create"
  | "update"
  | "delete"
  | "won"
  | "lost"
  | "status_change";
export type WorkflowStatusFilter = "all" | "active" | "inactive";

export interface WorkflowFilters {
  entity: WorkflowEntityFilter;
  event: WorkflowEventFilter;
  status: WorkflowStatusFilter;
}

export const defaultWorkflowFilters: WorkflowFilters = {
  entity: "all",
  event: "all",
  status: "all",
};

export const ENTITY_LABELS: Record<WorkflowEntityFilter, string> = {
  all: "All entities",
  lead: "Lead",
  deal: "Deal",
  organization: "Organization",
};

export const EVENT_LABELS: Record<WorkflowEventFilter, string> = {
  all: "All events",
  create: "Create",
  update: "Update",
  delete: "Delete",
  won: "Won",
  lost: "Lost",
  status_change: "Status Change",
};

export const STATUS_LABELS: Record<WorkflowStatusFilter, string> = {
  all: "All",
  active: "Active",
  inactive: "Inactive",
};
