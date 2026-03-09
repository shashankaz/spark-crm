import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
  type ChartConfig,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

import { useLeadSources } from "@/hooks";

const leadSourcesConfig: ChartConfig = {
  count: { label: "Leads", color: "#F59E0B" },
};

export const LeadSourcesWidget = () => {
  const { data, isPending } = useLeadSources();

  if (isPending) return <LeadSourcesSkeleton />;

  if (!data) return null;

  const leadSourcesData = data.data;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Lead Sources</CardTitle>
        <CardDescription>Where your leads are coming from</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 pb-4">
        <ChartContainer config={leadSourcesConfig} className="h-full w-full">
          <BarChart data={leadSourcesData} margin={{ left: 8, right: 8 }}>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              className="stroke-border"
            />
            <XAxis
              dataKey="source"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="#F59E0B" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

const LeadSourcesSkeleton = () => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent className="flex-1 min-h-0 pb-4">
        <Skeleton className="h-full w-full" />
      </CardContent>
    </Card>
  );
};
