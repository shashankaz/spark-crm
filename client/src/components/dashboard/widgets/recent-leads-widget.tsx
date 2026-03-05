import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import type { DashboardRecentLead } from "@/types/services";

const scoreColor = (score: number) => {
  if (score >= 85) return "text-green-600 dark:text-green-400";
  if (score >= 70) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
};

export const RecentLeadsWidget = ({
  recentLeads,
  isLoading,
}: {
  recentLeads?: DashboardRecentLead[];
  isLoading?: boolean;
}) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-base">Recent Leads</CardTitle>
        <CardDescription>Latest leads added to your CRM</CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0 flex-1 overflow-auto">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left px-6 py-2 font-medium text-muted-foreground">
                  Name
                </th>
                <th className="text-left px-6 py-2 font-medium text-muted-foreground">
                  Organization
                </th>
                <th className="text-right px-6 py-2 font-medium text-muted-foreground">
                  Score
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <RecentLeadsSkeleton key={i} />
                  ))
                : !recentLeads?.length
                  ? [
                      <tr key="empty">
                        <td
                          colSpan={3}
                          className="px-6 py-8 text-center text-sm text-muted-foreground"
                        >
                          No leads found
                        </td>
                      </tr>,
                    ]
                  : recentLeads?.map((lead) => (
                      <tr
                        key={lead._id}
                        className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-6 py-3">
                          <p className="font-medium">{lead.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {lead.email}
                          </p>
                        </td>
                        <td className="px-6 py-3 text-muted-foreground">
                          {lead.organization || "—"}
                        </td>
                        <td
                          className={`px-6 py-3 text-right font-semibold ${scoreColor(lead.score)}`}
                        >
                          {lead.score}
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

const RecentLeadsSkeleton = () => {
  return (
    <tr className="border-b last:border-0">
      <td className="px-6 py-3 space-y-1">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-36" />
      </td>
      <td className="px-6 py-3">
        <Skeleton className="h-4 w-24" />
      </td>
      <td className="px-6 py-3 flex justify-end">
        <Skeleton className="h-4 w-8" />
      </td>
    </tr>
  );
};
