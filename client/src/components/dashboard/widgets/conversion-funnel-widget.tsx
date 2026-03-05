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

const conversionFunnelData = [
  { stage: "Leads", count: 356 },
  { stage: "Contacted", count: 231 },
  { stage: "Qualified", count: 134 },
  { stage: "Proposal", count: 78 },
  { stage: "Closed", count: 45 },
];

const conversionFunnelConfig: ChartConfig = {
  count: { label: "Count", color: "hsl(var(--chart-1))" },
};

export const ConversionFunnelWidget = () => (
  <Card className="h-full flex flex-col">
    <CardHeader className="pb-2">
      <CardTitle className="text-base">Conversion Funnel</CardTitle>
      <CardDescription>Lead-to-deal conversion stages</CardDescription>
    </CardHeader>
    <CardContent className="flex-1 min-h-0 pb-4">
      <ChartContainer config={conversionFunnelConfig} className="h-full w-full">
        <BarChart
          layout="vertical"
          data={conversionFunnelData}
          margin={{ left: 12, right: 24 }}
        >
          <CartesianGrid
            horizontal={false}
            strokeDasharray="3 3"
            className="stroke-border"
          />
          <XAxis
            type="number"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            type="category"
            dataKey="stage"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            width={70}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar
            dataKey="count"
            fill="hsl(var(--chart-1))"
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ChartContainer>
    </CardContent>
  </Card>
);
