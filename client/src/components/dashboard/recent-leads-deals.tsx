import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { recentDeals, recentLeads } from "@/data/dashboard";

const statusVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  Won: "default",
  "In Progress": "secondary",
  Lost: "destructive",
};

const scoreColor = (score: number) => {
  if (score >= 85) return "text-green-600 dark:text-green-400";
  if (score >= 70) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
};

export const RecentLeadsDeals = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Leads</CardTitle>
          <CardDescription>Latest leads added to your CRM</CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0">
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
                {recentLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-3">
                      <p className="font-medium">{lead.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {lead.email}
                      </p>
                    </td>
                    <td className="px-6 py-3 text-muted-foreground">
                      {lead.organization}
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

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Deals</CardTitle>
          <CardDescription>Latest deals in your pipeline</CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0">
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
                {recentDeals.map((deal) => (
                  <tr
                    key={deal.id}
                    className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-3">
                      <p className="font-medium">{deal.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {deal.organization}
                      </p>
                    </td>
                    <td className="px-6 py-3 font-medium">{deal.value}</td>
                    <td className="px-6 py-3 text-right">
                      <Badge variant={statusVariant[deal.status]}>
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
    </div>
  );
};
