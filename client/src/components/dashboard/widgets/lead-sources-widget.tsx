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

const leadSourcesData = [
  { source: "website", count: 98 },
  { source: "facebook ads", count: 0 },
  { source: "google ads", count: 0 },
  { source: "instagram", count: 0 },
  { source: "linkedin", count: 61 },
  { source: "email marketing", count: 38 },
  { source: "referral", count: 74 },
  { source: "cold call", count: 43 },
  { source: "whatsapp", count: 0 },
  { source: "other", count: 0 },
];

const leadSourcesConfig: ChartConfig = {
  count: { label: "Leads", color: "hsl(var(--chart-2))" },
};

export const LeadSourcesWidget = () => (
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
          <Bar
            dataKey="count"
            fill="hsl(var(--chart-2))"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </CardContent>
  </Card>
);
