import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import type { TenantPlanDistribution } from "@/types/services";

const planColor: Record<string, string> = {
  Free: "bg-slate-400",
  Basic: "bg-blue-400",
  Pro: "bg-violet-500",
  Enterprise: "bg-amber-500",
};

export const PlanDistributionWidget = ({
  planDistribution = [],
  isLoading,
}: {
  planDistribution?: TenantPlanDistribution[];
  isLoading?: boolean;
}) => {
  const totalPlans = planDistribution.reduce((sum, p) => sum + p.count, 0);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-base">Plan Distribution</CardTitle>
        <CardDescription>
          Breakdown of active subscription plans
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <PlanDistributionWidgetSkeleton key={i} />
            ))
          : planDistribution.map((item) => {
              const pct = Math.round((item.count / totalPlans) * 100);
              const color = planColor[item.plan] ?? "bg-slate-400";

              return (
                <div key={item.plan} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium capitalize">{item.plan}</span>
                    <span className="text-muted-foreground">
                      {item.count} <span className="text-xs">({pct}%)</span>
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full ${color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}

        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total tenants</span>
            <span className="font-semibold">{totalPlans}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const PlanDistributionWidgetSkeleton = () => {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-2 w-full" />
    </div>
  );
};
