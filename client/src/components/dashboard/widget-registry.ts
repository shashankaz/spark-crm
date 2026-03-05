import {
  BarChart3,
  TrendingUp,
  PieChart,
  Activity,
  Phone,
  Star,
  Building2,
  Target,
  GitBranch,
} from "lucide-react";

export type CustomWidgetId =
  | "chart-lead-status"
  | "chart-monthly-revenue"
  | "chart-lead-sources"
  | "chart-deal-pipeline"
  | "chart-call-activity"
  | "chart-lead-score"
  | "chart-org-industry"
  | "chart-deal-win-rate"
  | "chart-conversion-funnel"
  | "chart-revenue-target";

export type WidgetMeta = {
  id: CustomWidgetId;
  title: string;
  description: string;
  icon: React.ElementType;
  category: "Leads" | "Deals" | "Organizations" | "Calls";
  defaultSize: { w: number; h: number; minW: number; minH: number };
};

export const CUSTOM_WIDGETS: WidgetMeta[] = [
  {
    id: "chart-lead-status",
    title: "Lead Status Distribution",
    description: "Donut chart showing leads by status",
    icon: PieChart,
    category: "Leads",
    defaultSize: { w: 4, h: 7, minW: 3, minH: 5 },
  },
  {
    id: "chart-monthly-revenue",
    title: "Monthly Revenue Trend",
    description: "Area chart of deal revenue over 8 months",
    icon: TrendingUp,
    category: "Deals",
    defaultSize: { w: 6, h: 7, minW: 4, minH: 5 },
  },
  {
    id: "chart-lead-sources",
    title: "Lead Sources",
    description: "Bar chart of where leads originate",
    icon: BarChart3,
    category: "Leads",
    defaultSize: { w: 6, h: 7, minW: 4, minH: 5 },
  },
  {
    id: "chart-deal-pipeline",
    title: "Deal Pipeline",
    description: "Deals grouped by value range",
    icon: Activity,
    category: "Deals",
    defaultSize: { w: 6, h: 7, minW: 4, minH: 5 },
  },
  {
    id: "chart-call-activity",
    title: "Call Activity",
    description: "Inbound vs outbound calls per month",
    icon: Phone,
    category: "Calls",
    defaultSize: { w: 6, h: 7, minW: 4, minH: 5 },
  },
  {
    id: "chart-lead-score",
    title: "Lead Score Distribution",
    description: "Leads grouped by quality score ranges",
    icon: Star,
    category: "Leads",
    defaultSize: { w: 4, h: 7, minW: 3, minH: 5 },
  },
  {
    id: "chart-org-industry",
    title: "Organizations by Industry",
    description: "Pie chart of industry verticals",
    icon: Building2,
    category: "Organizations",
    defaultSize: { w: 4, h: 7, minW: 3, minH: 5 },
  },
  {
    id: "chart-deal-win-rate",
    title: "Deal Win Rate",
    description: "Radial chart of deal outcome breakdown",
    icon: Target,
    category: "Deals",
    defaultSize: { w: 4, h: 7, minW: 3, minH: 5 },
  },
  {
    id: "chart-conversion-funnel",
    title: "Conversion Funnel",
    description: "Lead-to-deal conversion stages",
    icon: GitBranch,
    category: "Leads",
    defaultSize: { w: 4, h: 7, minW: 3, minH: 5 },
  },
  {
    id: "chart-revenue-target",
    title: "Revenue vs Target",
    description: "Actual revenue vs monthly targets",
    icon: BarChart3,
    category: "Deals",
    defaultSize: { w: 6, h: 7, minW: 4, minH: 5 },
  },
];
