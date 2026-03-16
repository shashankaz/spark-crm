export type ScoreRange = "any" | "low" | "medium" | "high";

export interface LeadFilters {
  assignment: "all" | "assigned";
  orgName: string;
  scoreRange: ScoreRange;
}

export const defaultFilters: LeadFilters = {
  assignment: "all",
  orgName: "",
  scoreRange: "any",
};

export const SCORE_RANGE_LABELS: Record<ScoreRange, string> = {
  any: "Any score",
  low: "Low (0 - 30)",
  medium: "Medium (31 - 60)",
  high: "High (61 - 100)",
};
