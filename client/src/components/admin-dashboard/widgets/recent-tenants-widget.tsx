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

import type { TenantRecentTenant } from "@/types/services/tenant.service.types";

const planVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  Enterprise: "default",
  Pro: "secondary",
  Basic: "outline",
  Free: "outline",
};

export const RecentTenantsWidget = ({
  recentTenants = [],
  isLoading,
}: {
  recentTenants?: TenantRecentTenant[];
  isLoading?: boolean;
}) => {
  return (
    <Card className="h-full flex flex-col">
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
      <CardContent className="px-0 pb-0 flex-1 overflow-auto">
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
                    <RecentTenantsWidgetSkeleton key={i} />
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
  );
};

const RecentTenantsWidgetSkeleton = () => {
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
