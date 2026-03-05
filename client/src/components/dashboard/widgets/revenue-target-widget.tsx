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

const revenueTargetData = [
  { month: "Jan", actual: 89000, target: 80000 },
  { month: "Feb", actual: 94000, target: 90000 },
  { month: "Mar", actual: 112000, target: 100000 },
  { month: "Apr", actual: 78000, target: 85000 },
  { month: "May", actual: 83000, target: 90000 },
  { month: "Jun", actual: 91000, target: 95000 },
  { month: "Jul", actual: 97000, target: 100000 },
  { month: "Aug", actual: 102000, target: 105000 },
  { month: "Sep", actual: 88000, target: 92000 },
  { month: "Oct", actual: 51000, target: 60000 },
  { month: "Nov", actual: 73000, target: 65000 },
  { month: "Dec", actual: 65000, target: 70000 },
];

const revenueTargetConfig: ChartConfig = {
  actual: { label: "Actual ($)", color: "hsl(var(--chart-1))" },
  target: { label: "Target ($)", color: "hsl(var(--chart-3))" },
};

export const RevenueTargetWidget = () => (
  <Card className="h-full flex flex-col">
    <CardHeader className="pb-2">
      <CardTitle className="text-base">Revenue vs Target</CardTitle>
      <CardDescription>Actual revenue against monthly targets</CardDescription>
    </CardHeader>
    <CardContent className="flex-1 min-h-0 pb-4">
      <ChartContainer config={revenueTargetConfig} className="h-full w-full">
        <BarChart data={revenueTargetData} margin={{ left: 8, right: 8 }}>
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
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value) => [`$${Number(value).toLocaleString()}`]}
              />
            }
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey="actual"
            fill="hsl(var(--chart-1))"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="target"
            fill="hsl(var(--chart-3))"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </CardContent>
  </Card>
);
