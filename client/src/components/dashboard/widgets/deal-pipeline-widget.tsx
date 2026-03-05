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

const dealPipelineData = [
  { range: "$0-5k", count: 34, value: 87000 },
  { range: "$5-20k", count: 51, value: 612000 },
  { range: "$20-50k", count: 28, value: 980000 },
  { range: "$50-100k", count: 14, value: 1050000 },
  { range: "$100k+", count: 7, value: 1240000 },
];

const dealPipelineConfig: ChartConfig = {
  count: { label: "# Deals", color: "hsl(var(--chart-4))" },
  value: { label: "Total Value", color: "hsl(var(--chart-1))" },
};

export const DealPipelineWidget = () => (
  <Card className="h-full flex flex-col">
    <CardHeader className="pb-2">
      <CardTitle className="text-base">Deal Pipeline</CardTitle>
      <CardDescription>Deals grouped by value range</CardDescription>
    </CardHeader>
    <CardContent className="flex-1 min-h-0 pb-4">
      <ChartContainer config={dealPipelineConfig} className="h-full w-full">
        <BarChart data={dealPipelineData} margin={{ left: 8, right: 8 }}>
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
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey="count"
            fill="hsl(var(--chart-4))"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </CardContent>
  </Card>
);
