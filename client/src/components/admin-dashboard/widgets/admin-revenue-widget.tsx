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

import { useAdminRevenue } from "@/hooks";

const config: ChartConfig = {
  enterprise: { label: "Enterprise", color: "#F59E0B" },
  pro: { label: "Pro", color: "#8B5CF6" },
  basic: { label: "Basic", color: "#3B82F6" },
  free: { label: "Free", color: "#6B7280" },
};

export const AdminRevenueWidget = () => {
  const { data, isPending } = useAdminRevenue();

  if (isPending) return <AdminRevenueSkeleton />;

  if (!data) return null;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Revenue by Plan</CardTitle>
        <CardDescription>
          Monthly revenue broken down by subscription tier
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 pb-4">
        <ChartContainer config={config} className="h-full w-full">
          <AreaChart data={data.data} margin={{ left: 8, right: 8 }}>
            <defs>
              {(
                [
                  ["enterprise", "#F59E0B"],
                  ["pro", "#8B5CF6"],
                  ["basic", "#3B82F6"],
                ] as const
              ).map(([key, color]) => (
                <linearGradient
                  key={key}
                  id={`color-${key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.0} />
                </linearGradient>
              ))}
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
              tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => [
                    `₹${Number(value).toLocaleString("en-IN")}`,
                    String(name).charAt(0).toUpperCase() +
                      String(name).slice(1),
                  ]}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="enterprise"
              stroke="#F59E0B"
              strokeWidth={2}
              fill="url(#color-enterprise)"
              stackId="1"
            />
            <Area
              type="monotone"
              dataKey="pro"
              stroke="#8B5CF6"
              strokeWidth={2}
              fill="url(#color-pro)"
              stackId="1"
            />
            <Area
              type="monotone"
              dataKey="basic"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#color-basic)"
              stackId="1"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

const AdminRevenueSkeleton = () => (
  <Card className="h-full flex flex-col">
    <CardHeader className="pb-2">
      <Skeleton className="h-5 w-36" />
      <Skeleton className="h-4 w-56" />
    </CardHeader>
    <CardContent className="flex-1 min-h-0 pb-4">
      <Skeleton className="h-full w-full" />
    </CardContent>
  </Card>
);
