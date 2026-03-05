import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";

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

const leadScoreData = [
  { range: "0-25", count: 18, fill: "hsl(var(--chart-5))" },
  { range: "26-50", count: 41, fill: "hsl(var(--chart-4))" },
  { range: "51-75", count: 87, fill: "hsl(var(--chart-3))" },
  { range: "76-100", count: 54, fill: "hsl(var(--chart-2))" },
];

const leadScoreConfig: ChartConfig = {
  count: { label: "Leads", color: "hsl(var(--chart-3))" },
};

export const LeadScoreWidget = () => (
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
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {leadScoreData.map((entry) => (
              <Cell key={entry.range} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </CardContent>
  </Card>
);
