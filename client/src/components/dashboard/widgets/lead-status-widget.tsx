import { Cell, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

import { useLeadStatus } from "@/hooks";

const leadStatusConfig: ChartConfig = {
  count: { label: "Leads", color: "#06B6D4" },
  new: { label: "New", color: "#3B82F6" },
  contacted: { label: "Contacted", color: "#F59E0B" },
  qualified: { label: "Qualified", color: "#10B981" },
  converted: { label: "Converted", color: "#8B5CF6" },
  lost: { label: "Lost", color: "#EF4444" },
};

const statusFills: Record<string, string> = {
  new: "#3B82F6",
  contacted: "#F59E0B",
  qualified: "#10B981",
  converted: "#8B5CF6",
  lost: "#EF4444",
};

export const LeadStatusWidget = () => {
  const { data, isPending } = useLeadStatus();

  if (isPending) return <LeadStatusSkeleton />;

  if (!data) return null;

  const leadStatusData = data.data;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Lead Status Distribution</CardTitle>
        <CardDescription>Breakdown of leads by current status</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 pb-4">
        <ChartContainer config={leadStatusConfig} className="h-full w-full">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={leadStatusData}
              dataKey="count"
              nameKey="status"
              innerRadius="45%"
              outerRadius="75%"
              paddingAngle={3}
            >
              {leadStatusData.map((entry) => (
                <Cell
                  key={entry.status}
                  fill={statusFills[entry.status.toLowerCase()] ?? "#6B7280"}
                />
              ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="status" />}
              className="flex-wrap gap-2 justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

const LeadStatusSkeleton = () => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-44" />
        <Skeleton className="h-4 w-52" />
      </CardHeader>
      <CardContent className="flex-1 min-h-0 pb-4">
        <Skeleton className="h-full w-full" />
      </CardContent>
    </Card>
  );
};
