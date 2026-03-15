import { CartesianGrid, XAxis, YAxis, Bar, BarChart } from "recharts";

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

import { useAdminTenantGrowth } from "@/hooks";

const config: ChartConfig = {
  newTenants: { label: "New Tenants", color: "#6366F1" },
};

export const TenantGrowthWidget = () => {
  const { data, isPending } = useAdminTenantGrowth();

  if (isPending) return <TenantGrowthSkeleton />;

  if (!data) return null;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Tenant Growth</CardTitle>
        <CardDescription>New tenants registered per month</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 pb-4">
        <ChartContainer config={config} className="h-full w-full">
          <BarChart data={data.data} margin={{ left: 8, right: 8 }}>
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
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="newTenants" fill="#6366F1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

const TenantGrowthSkeleton = () => (
  <Card className="h-full flex flex-col">
    <CardHeader className="pb-2">
      <Skeleton className="h-5 w-36" />
      <Skeleton className="h-4 w-52" />
    </CardHeader>
    <CardContent className="flex-1 min-h-0 pb-4">
      <Skeleton className="h-full w-full" />
    </CardContent>
  </Card>
);
