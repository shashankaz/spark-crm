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

import { useAdminUserGrowth } from "@/hooks";

const config: ChartConfig = {
  admin: { label: "Admins", color: "#06B6D4" },
  user: { label: "Users", color: "#22C55E" },
};

export const UserGrowthWidget = () => {
  const { data, isPending } = useAdminUserGrowth();

  if (isPending) return <UserGrowthSkeleton />;

  if (!data) return null;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">User Growth</CardTitle>
        <CardDescription>New admins and users added per month</CardDescription>
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
            <Bar
              dataKey="admin"
              fill="#06B6D4"
              radius={[4, 4, 0, 0]}
              stackId="a"
            />
            <Bar
              dataKey="user"
              fill="#22C55E"
              radius={[4, 4, 0, 0]}
              stackId="a"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

const UserGrowthSkeleton = () => (
  <Card className="h-full flex flex-col">
    <CardHeader className="pb-2">
      <Skeleton className="h-5 w-28" />
      <Skeleton className="h-4 w-52" />
    </CardHeader>
    <CardContent className="flex-1 min-h-0 pb-4">
      <Skeleton className="h-full w-full" />
    </CardContent>
  </Card>
);
