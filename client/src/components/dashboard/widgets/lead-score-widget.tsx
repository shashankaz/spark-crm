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

import { useLeadScore } from "@/hooks";

const leadScoreConfig: ChartConfig = {
  count: { label: "Leads", color: "#10B981" },
};

export const LeadScoreWidget = () => {
  const { data, isPending } = useLeadScore();

  if (isPending) return <LeadScoreSkeleton />;

  if (!data) return null;

  const leadScoreData = data.data;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Lead Score Distribution</CardTitle>
        <CardDescription>Leads grouped by quality score</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 pb-4">
        <ChartContainer config={leadScoreConfig} className="h-full w-full">
          <BarChart data={leadScoreData} margin={{ left: 8, right: 8 }}>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              className="stroke-border"
            />
            <XAxis
              dataKey="range"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

const LeadScoreSkeleton = () => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-44" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent className="flex-1 min-h-0 pb-4">
        <Skeleton className="h-full w-full" />
      </CardContent>
    </Card>
  );
};
