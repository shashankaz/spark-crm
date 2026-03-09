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
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

import { useCallActivity } from "@/hooks";

const callActivityConfig: ChartConfig = {
  inbound: { label: "Inbound", color: "#22C55E" },
  outbound: { label: "Outbound", color: "#F97316" },
};

export const CallActivityWidget = () => {
  const { data, isPending } = useCallActivity();

  if (isPending) return <CallActivitySkeleton />;

  if (!data) return null;

  const callActivityData = data.data;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Call Activity</CardTitle>
        <CardDescription>Inbound vs outbound calls per month</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 pb-4">
        <ChartContainer config={callActivityConfig} className="h-full w-full">
          <BarChart data={callActivityData} margin={{ left: 8, right: 8 }}>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              className="stroke-border"
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="inbound" fill="#22C55E" radius={[4, 4, 0, 0]} />
            <Bar dataKey="outbound" fill="#F97316" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

const CallActivitySkeleton = () => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-52" />
      </CardHeader>
      <CardContent className="flex-1 min-h-0 pb-4">
        <Skeleton className="h-full w-full" />
      </CardContent>
    </Card>
  );
};
