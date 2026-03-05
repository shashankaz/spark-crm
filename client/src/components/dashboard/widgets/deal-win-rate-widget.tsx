import { Cell, RadialBar, RadialBarChart } from "recharts";

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

const dealWinRateData = [
  { name: "Closed Won", value: 62, fill: "hsl(var(--chart-2))" },
  { name: "In Progress", value: 23, fill: "hsl(var(--chart-3))" },
  { name: "Closed Lost", value: 15, fill: "hsl(var(--chart-5))" },
];

const dealWinRateConfig: ChartConfig = {
  "Closed Won": { label: "Closed Won", color: "hsl(var(--chart-2))" },
  "In Progress": { label: "In Progress", color: "hsl(var(--chart-3))" },
  "Closed Lost": { label: "Closed Lost", color: "hsl(var(--chart-5))" },
};

export const DealWinRateWidget = () => (
  <Card className="h-full flex flex-col">
    <CardHeader className="pb-2">
      <CardTitle className="text-base">Deal Win Rate</CardTitle>
      <CardDescription>Current deal outcome distribution</CardDescription>
    </CardHeader>
    <CardContent className="flex-1 min-h-0 pb-4 flex items-center">
      <ChartContainer config={dealWinRateConfig} className="h-full w-full">
        <RadialBarChart
          data={dealWinRateData}
          innerRadius="30%"
          outerRadius="90%"
          startAngle={180}
          endAngle={0}
        >
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel nameKey="name" />}
          />
          <RadialBar dataKey="value" background cornerRadius={4}>
            {dealWinRateData.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
          </RadialBar>
        </RadialBarChart>
      </ChartContainer>
    </CardContent>
  </Card>
);
