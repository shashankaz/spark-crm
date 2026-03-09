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
import { Skeleton } from "@/components/ui/skeleton";

import { useMonthlyRevenue } from "@/hooks";

const revenueConfig: ChartConfig = {
  revenue: { label: "Revenue ($)", color: "#06B6D4" },
  deals: { label: "Deals Closed", color: "#22C55E" },
};

export const MonthlyRevenueWidget = () => {
  const { data, isPending } = useMonthlyRevenue();

  if (isPending) return <MonthlyRevenueSkeleton />;

  if (!data) return null;

  const monthlyRevenueData = data.data;

  return (
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
                <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
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
              stroke="#06B6D4"
              strokeWidth={2}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

const MonthlyRevenueSkeleton = () => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-44" />
        <Skeleton className="h-4 w-52" />
      </CardHeader>
      <CardContent className="flex-1 min-h-0 pb-4">
        <Skeleton className="h-full w-full" />
      </CardContent>
    </Card>
  );
};
