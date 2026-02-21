import {
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Users,
  CreditCard,
  TrendingUp,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import type { TenantDashboardStat } from "@/api/services/tenant.service";

type StatsData = {
  totalTenants: TenantDashboardStat;
  totalUsers: TenantDashboardStat;
  monthlyRevenue: TenantDashboardStat;
  paidPlans: TenantDashboardStat;
};

const STAT_META = [
  { key: "totalTenants" as const, title: "Total Tenants", icon: Building2 },
  { key: "totalUsers" as const, title: "Total Users", icon: Users },
  {
    key: "monthlyRevenue" as const,
    title: "Monthly Revenue",
    icon: CreditCard,
  },
  { key: "paidPlans" as const, title: "Paid Plans", icon: TrendingUp },
];

type Props = {
  stats?: StatsData;
  isLoading?: boolean;
};

export const StatsSection = ({ stats, isLoading }: Props) => {
  if (isLoading) return <StatsSectionSkeleton />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {STAT_META.map((meta) => {
        const Icon = meta.icon;
        const stat = stats?.[meta.key];
        const isUp = stat?.trend === "up";

        const displayValue =
          meta.key === "monthlyRevenue"
            ? `$${stat?.value?.toLocaleString() ?? 0}`
            : (stat?.value?.toLocaleString() ?? 0);

        return (
          <Card key={meta.key}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardDescription className="text-sm font-medium">
                  {meta.title}
                </CardDescription>
                <div className="rounded-md bg-muted p-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-6">
              <p className="text-3xl font-bold tracking-tight">
                {displayValue}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {isUp ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                )}
                <span
                  className={`text-sm font-medium ${
                    isUp
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {stat?.change}
                </span>
                <span className="text-xs text-muted-foreground">
                  vs last month
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

const StatsSectionSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {STAT_META.map((meta) => (
        <Card key={meta.key}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </CardHeader>
          <CardContent className="px-6 space-y-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-36" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
