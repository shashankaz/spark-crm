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

import { useAdminTopTenants } from "@/hooks";

const planVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  enterprise: "default",
  pro: "secondary",
  basic: "outline",
  free: "outline",
};

const planColors: Record<string, string> = {
  enterprise: "text-amber-500",
  pro: "text-violet-500",
  basic: "text-blue-500",
  free: "text-slate-400",
};

export const TopTenantsWidget = () => {
  const { data, isPending } = useAdminTopTenants();

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Top Tenants</CardTitle>
            <CardDescription>
              Highest-value tenants by subscription plan
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
                <th className="text-right px-6 py-2 font-medium text-muted-foreground">
                  Users
                </th>
                <th className="text-right px-6 py-2 font-medium text-muted-foreground">
                  Plan
                </th>
                <th className="text-right px-6 py-2 font-medium text-muted-foreground">
                  MRR
                </th>
              </tr>
            </thead>
            <tbody>
              {isPending
                ? Array.from({ length: 5 }).map((_, i) => (
                    <TopTenantsSkeleton key={i} />
                  ))
                : data?.data.map((tenant, i) => (
                    <tr
                      key={i}
                      className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-6 py-3">
                        <p className="font-medium truncate max-w-40">
                          {tenant.name}
                        </p>
                      </td>
                      <td className="px-6 py-3 text-right text-muted-foreground">
                        {tenant.userCount}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <Badge
                          variant={planVariant[tenant.plan] ?? "outline"}
                          className={`capitalize ${planColors[tenant.plan] ?? ""}`}
                        >
                          {tenant.plan}
                        </Badge>
                      </td>
                      <td className="px-6 py-3 text-right font-medium">
                        {Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: "INR",
                          maximumFractionDigits: 0,
                        }).format(tenant.revenue)}
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

const TopTenantsSkeleton = () => (
  <tr className="border-b last:border-0">
    <td className="px-6 py-3">
      <Skeleton className="h-4 w-32" />
    </td>
    <td className="px-6 py-3 flex justify-end">
      <Skeleton className="h-4 w-8" />
    </td>
    <td className="px-6 py-3">
      <div className="flex justify-end">
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    </td>
    <td className="px-6 py-3">
      <div className="flex justify-end">
        <Skeleton className="h-4 w-20" />
      </div>
    </td>
  </tr>
);
