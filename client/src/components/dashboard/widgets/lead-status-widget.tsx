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

const leadStatusData = [
  { status: "New", count: 124, fill: "var(--color-new)" },
  { status: "Contacted", count: 89, fill: "var(--color-contacted)" },
  { status: "Qualified", count: 67, fill: "var(--color-qualified)" },
  { status: "Converted", count: 45, fill: "var(--color-converted)" },
  { status: "Lost", count: 31, fill: "var(--color-lost)" },
];

const leadStatusConfig: ChartConfig = {
  count: { label: "Leads" },
  new: { label: "New", color: "hsl(var(--chart-1))" },
  contacted: { label: "Contacted", color: "hsl(var(--chart-2))" },
  qualified: { label: "Qualified", color: "hsl(var(--chart-3))" },
  converted: { label: "Converted", color: "hsl(var(--chart-4))" },
  lost: { label: "Lost", color: "hsl(var(--chart-5))" },
};

export const LeadStatusWidget = () => (
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
              <Cell key={entry.status} fill={entry.fill} />
            ))}
          </Pie>
          <ChartLegend
            content={<ChartLegendContent nameKey="status" />}
            className="-translate-y-2 flex-wrap gap-2 *:basis-1/3 *:justify-center"
          />
        </PieChart>
      </ChartContainer>
    </CardContent>
  </Card>
);
