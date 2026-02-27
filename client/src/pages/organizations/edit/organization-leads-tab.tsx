import { useMemo, useState } from "react";
import {
  Users,
  Star,
  TrendingUp,
  CheckCircle,
  XCircle,
  PhoneCall,
} from "lucide-react";
import { debounce } from "lodash";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { DataTable } from "@/components/shared/dashboard/data-table";

import { columns } from "./columns";

import { useLeads } from "@/hooks";

interface OrganizationLeadsTabProps {
  orgId: string;
}

export const OrganizationLeadsTab = ({ orgId }: OrganizationLeadsTabProps) => {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const handleSearchChange = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearch(value);
      }, 500),
    [],
  );

  const { data, isPending } = useLeads({
    orgId,
    limit: 100,
    search: debouncedSearch,
  });
  const leads = data?.leads ?? [];

  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    qualified: leads.filter((l) => l.status === "qualified").length,
    converted: leads.filter((l) => l.status === "converted").length,
    lost: leads.filter((l) => l.status === "lost").length,
  };

  const avgScore =
    leads.length > 0
      ? Math.round(
          leads.reduce((sum, l) => sum + (l.score ?? 0), 0) / leads.length,
        )
      : 0;

  const statCards = [
    {
      title: "Total Leads",
      value: stats.total,
      icon: Users,
      description: "All leads linked to this org",
    },
    {
      title: "Avg. Score",
      value: avgScore,
      icon: Star,
      description: "Average lead score",
    },
    {
      title: "Qualified",
      value: stats.qualified,
      icon: TrendingUp,
      description: "Leads marked as qualified",
    },
    {
      title: "Converted",
      value: stats.converted,
      icon: CheckCircle,
      description: "Leads converted to deals",
    },
    {
      title: "Contacted",
      value: stats.contacted,
      icon: PhoneCall,
      description: "Leads that were contacted",
    },
    {
      title: "Lost",
      value: stats.lost,
      icon: XCircle,
      description: "Leads marked as lost",
    },
  ];

  if (isPending) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-20" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-12" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="h-48 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={leads}
        placeholder="leads"
        search={searchInput}
        onSearchChange={(value) => {
          setSearchInput(value);
          handleSearchChange(value);
        }}
      />
    </div>
  );
};
