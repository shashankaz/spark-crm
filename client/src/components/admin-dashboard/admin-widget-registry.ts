import { TrendingUp, BarChart3, PieChart, Users, Trophy } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type AdminCustomWidgetId =
  | "chart-tenant-growth"
  | "chart-admin-revenue"
  | "chart-plan-distribution"
  | "chart-user-growth"
  | "chart-top-tenants";

export type AdminWidgetMeta = {
  id: AdminCustomWidgetId;
  title: string;
  description: string;
  icon: LucideIcon;
  category: "Tenants" | "Revenue" | "Users";
  defaultSize: { w: number; h: number; minW: number; minH: number };
};

export const ADMIN_CUSTOM_WIDGETS: AdminWidgetMeta[] = [
  {
    id: "chart-tenant-growth",
    title: "Tenant Growth",
    description: "New tenants registered each month",
    icon: TrendingUp,
    category: "Tenants",
    defaultSize: { w: 6, h: 7, minW: 4, minH: 5 },
  },
  {
    id: "chart-admin-revenue",
    title: "Revenue by Plan",
    description: "Monthly revenue broken down by subscription plan",
    icon: BarChart3,
    category: "Revenue",
    defaultSize: { w: 6, h: 7, minW: 4, minH: 5 },
  },
  {
    id: "chart-plan-distribution",
    title: "Plan Distribution",
    description: "Pie chart of tenants across subscription tiers",
    icon: PieChart,
    category: "Tenants",
    defaultSize: { w: 4, h: 7, minW: 3, minH: 5 },
  },
  {
    id: "chart-user-growth",
    title: "User Growth",
    description: "New users (admins & users) added each month",
    icon: Users,
    category: "Users",
    defaultSize: { w: 6, h: 7, minW: 4, minH: 5 },
  },
  {
    id: "chart-top-tenants",
    title: "Top Tenants",
    description: "Highest-value tenants ranked by plan revenue",
    icon: Trophy,
    category: "Tenants",
    defaultSize: { w: 6, h: 7, minW: 4, minH: 5 },
  },
];
