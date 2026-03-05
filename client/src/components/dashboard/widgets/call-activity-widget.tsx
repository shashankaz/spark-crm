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

const callActivityData = [
  { month: "Jan", inbound: 45, outbound: 71 },
  { month: "Feb", inbound: 52, outbound: 68 },
  { month: "Mar", inbound: 61, outbound: 84 },
  { month: "Apr", inbound: 38, outbound: 57 },
  { month: "May", inbound: 42, outbound: 63 },
  { month: "Jun", inbound: 47, outbound: 69 },
  { month: "Jul", inbound: 51, outbound: 73 },
  { month: "Aug", inbound: 49, outbound: 70 },
  { month: "Sep", inbound: 44, outbound: 66 },
  { month: "Oct", inbound: 32, outbound: 48 },
  { month: "Nov", inbound: 41, outbound: 63 },
  { month: "Dec", inbound: 28, outbound: 55 },
];

const callActivityConfig: ChartConfig = {
  inbound: { label: "Inbound", color: "hsl(var(--chart-2))" },
  outbound: { label: "Outbound", color: "hsl(var(--chart-4))" },
};

export const CallActivityWidget = () => (
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
          <Bar
            dataKey="inbound"
            fill="hsl(var(--chart-2))"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="outbound"
            fill="hsl(var(--chart-4))"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </CardContent>
  </Card>
);
