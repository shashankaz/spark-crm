import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import type { DashboardRecentDeal } from "@/types/services";

const statusVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  new: "outline",
  contacted: "secondary",
  qualified: "default",
  converted: "default",
  lost: "destructive",
};

export const RecentDealsWidget = ({
  recentDeals,
  isLoading,
}: {
  recentDeals?: DashboardRecentDeal[];
  isLoading?: boolean;
}) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-base">Recent Deals</CardTitle>
        <CardDescription>Latest deals in your pipeline</CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0 flex-1 overflow-auto">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left px-6 py-2 font-medium text-muted-foreground">
                  Deal
                </th>
                <th className="text-left px-6 py-2 font-medium text-muted-foreground">
                  Value
                </th>
                <th className="text-right px-6 py-2 font-medium text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <RecentDealsSkeleton key={i} />
                  ))
                : !recentDeals?.length
                  ? [
                      <tr key="empty">
                        <td
                          colSpan={3}
                          className="px-6 py-8 text-center text-sm text-muted-foreground"
                        >
                          No deals found
                        </td>
                      </tr>,
                    ]
                  : recentDeals?.map((deal) => (
                      <tr
                        key={deal._id}
                        className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-6 py-3">
                          <p className="font-medium">{deal.title}</p>
                        </td>
                        <td className="px-6 py-3 font-medium">
                          ${deal.value.toLocaleString()}
                        </td>
                        <td className="px-6 py-3 text-right">
                          <Badge
                            variant={statusVariant[deal.status] ?? "outline"}
                          >
                            {deal.status}
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

const RecentDealsSkeleton = () => {
  return (
    <tr className="border-b last:border-0">
      <td className="px-6 py-3">
        <Skeleton className="h-4 w-32" />
      </td>
      <td className="px-6 py-3">
        <Skeleton className="h-4 w-20" />
      </td>
      <td className="px-6 py-3 flex justify-end">
        <Skeleton className="h-5 w-20 rounded-full" />
      </td>
    </tr>
  );
};
