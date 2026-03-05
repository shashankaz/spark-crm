import { CartesianGrid, XAxis, YAxis, Area, AreaChart } from "recharts";

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

const monthlyRevenueData = [
  { month: "Jan", revenue: 82000, deals: 34 },
  { month: "Feb", revenue: 91000, deals: 39 },
  { month: "Mar", revenue: 105000, deals: 44 },
  { month: "Apr", revenue: 97000, deals: 40 },
  { month: "May", revenue: 115000, deals: 49 },
  { month: "Jun", revenue: 123000, deals: 53 },
  { month: "Jul", revenue: 118000, deals: 50 },
  { month: "Aug", revenue: 110000, deals: 46 },
  { month: "Sep", revenue: 126000, deals: 55 },
  { month: "Oct", revenue: 134000, deals: 58 },
  { month: "Nov", revenue: 142000, deals: 61 },
  { month: "Dec", revenue: 158000, deals: 67 },
];

const revenueConfig: ChartConfig = {
  revenue: { label: "Revenue ($)", color: "hsl(var(--chart-1))" },
  deals: { label: "Deals Closed", color: "hsl(var(--chart-2))" },
};

export const MonthlyRevenueWidget = () => (
  <Card className="h-full flex flex-col">
    <CardHeader className="pb-2">
      <CardTitle className="text-base">Monthly Revenue Trend</CardTitle>
      <CardDescription>Deal revenue over the last 8 months</CardDescription>
    </CardHeader>
    <CardContent className="flex-1 min-h-0 pb-4">
      <ChartContainer config={revenueConfig} className="h-full w-full">
        <AreaChart data={monthlyRevenueData} margin={{ left: 8, right: 8 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="hsl(var(--chart-1))"
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor="hsl(var(--chart-1))"
                stopOpacity={0.0}
              />
            </linearGradient>
          </defs>
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
                formatter={(value, name) =>
                  name === "revenue"
                    ? [`$${Number(value).toLocaleString()}`, "Revenue"]
                    : [value, "Deals Closed"]
                }
              />
            }
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="hsl(var(--chart-1))"
            strokeWidth={2}
            fill="url(#colorRevenue)"
          />
        </AreaChart>
      </ChartContainer>
    </CardContent>
  </Card>
);
