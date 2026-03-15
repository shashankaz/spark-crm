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
import { Skeleton } from "@/components/ui/skeleton";

import { useAdminPlanDistributionChart } from "@/hooks";

const planColors: Record<string, string> = {
  free: "#6B7280",
  basic: "#3B82F6",
  pro: "#8B5CF6",
  enterprise: "#F59E0B",
};

const config: ChartConfig = {
  count: { label: "Tenants" },
  free: { label: "Free", color: "#6B7280" },
  basic: { label: "Basic", color: "#3B82F6" },
  pro: { label: "Pro", color: "#8B5CF6" },
  enterprise: { label: "Enterprise", color: "#F59E0B" },
};

export const PlanDistributionChartWidget = () => {
  const { data, isPending } = useAdminPlanDistributionChart();

  if (isPending) return <PlanDistributionChartSkeleton />;

  if (!data) return null;

  const chartData = data.data.map((item) => ({
    ...item,
    fill: planColors[item.plan] ?? "#6B7280",
  }));

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Plan Distribution</CardTitle>
        <CardDescription>Tenants across subscription tiers</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 pb-4">
        <ChartContainer config={config} className="h-full w-full">
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => [
                    `${value} tenants`,
                    String(name).charAt(0).toUpperCase() +
                      String(name).slice(1),
                  ]}
                />
              }
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="plan"
              innerRadius="40%"
              outerRadius="72%"
              paddingAngle={3}
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.plan}
                  fill={planColors[entry.plan] ?? "#6B7280"}
                />
              ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="plan" />}
              className="flex-wrap gap-2 justify-center capitalize"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

const PlanDistributionChartSkeleton = () => (
  <Card className="h-full flex flex-col">
    <CardHeader className="pb-2">
      <Skeleton className="h-5 w-36" />
      <Skeleton className="h-4 w-48" />
    </CardHeader>
    <CardContent className="flex-1 min-h-0 pb-4">
      <Skeleton className="h-full w-full" />
    </CardContent>
  </Card>
);
