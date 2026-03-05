import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import type { DashboardStat } from "@/types/services";

export const StatCardWidget = ({
  title,
  icon: Icon,
  stat,
  isLoading,
}: {
  title: string;
  icon: LucideIcon;
  stat?: DashboardStat;
  isLoading?: boolean;
}) => {
  if (isLoading) return <StatCardSkeleton />;

  const isUp = stat?.trend === "up";

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardDescription className="text-sm font-medium">
            {title}
          </CardDescription>
          <div className="rounded-md bg-muted p-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-6">
        <p className="text-3xl font-bold tracking-tight">
          {stat?.value?.toLocaleString() ?? 0}
        </p>
        <div className="flex items-center gap-1 mt-1">
          {isUp ? (
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          ) : (
            <ArrowDownRight className="h-4 w-4 text-error" />
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
          <span className="text-xs text-muted-foreground">vs last month</span>
        </div>
      </CardContent>
    </Card>
  );
};

const StatCardSkeleton = () => (
  <Card className="h-full">
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
);
