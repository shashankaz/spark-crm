import { Link } from "react-router";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import type {
  TenantRecentTenant,
  TenantPlanDistribution,
} from "@/api/services/tenant.service";

const planVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  Enterprise: "default",
  Pro: "secondary",
  Basic: "outline",
  Free: "outline",
};

const planColor: Record<string, string> = {
  Free: "bg-slate-400",
  Basic: "bg-blue-400",
  Pro: "bg-violet-500",
  Enterprise: "bg-amber-500",
};

type Props = {
  recentTenants?: TenantRecentTenant[];
  planDistribution?: TenantPlanDistribution[];
  isLoading?: boolean;
};

export const TenantsStats = ({
  recentTenants = [],
  planDistribution = [],
  isLoading,
}: Props) => {
  const totalPlans = planDistribution.reduce((sum, p) => sum + p.count, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Recent Tenants</CardTitle>
              <CardDescription>
                Latest tenants registered on the platform
              </CardDescription>
            </div>
            <Link
              to="/admin/tenants"
              className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
            >
              View all
            </Link>
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left px-6 py-2 font-medium text-muted-foreground">
                    Tenant
                  </th>
                  <th className="text-left px-6 py-2 font-medium text-muted-foreground">
                    Location
                  </th>
                  <th className="text-right px-6 py-2 font-medium text-muted-foreground">
                    Plan
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <RecentTenantsSkeleton key={i} />
                    ))
                  : recentTenants.map((tenant) => (
                      <tr
                        key={tenant._id}
                        className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-6 py-3">
                          <p className="font-medium truncate max-w-40">
                            {tenant.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {tenant.email}
                          </p>
                        </td>
                        <td className="px-6 py-3 text-muted-foreground truncate max-w-48">
                          {tenant.city}, {tenant.country}
                        </td>
                        <td className="px-6 py-3 text-right capitalize">
                          <Badge variant={planVariant[tenant.plan]}>
                            {tenant.plan}
                          </Badge>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Plan Distribution</CardTitle>
          <CardDescription>
            Breakdown of active subscription plans
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <PlanDistributionSkeleton key={i} />
              ))
            : planDistribution.map((item) => {
                const pct = Math.round((item.count / totalPlans) * 100);
                const color = planColor[item.plan] ?? "bg-slate-400";

                return (
                  <div key={item.plan} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium capitalize">
                        {item.plan}
                      </span>
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
    </div>
  );
};

const RecentTenantsSkeleton = () => {
  return (
    <tr className="border-b last:border-0">
      <td className="px-6 py-3 space-y-1">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-44" />
      </td>
      <td className="px-6 py-3">
        <Skeleton className="h-4 w-28" />
      </td>
      <td className="px-6 py-3 flex justify-end">
        <Skeleton className="h-5 w-16 rounded-full" />
      </td>
    </tr>
  );
};

const PlanDistributionSkeleton = () => {
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
