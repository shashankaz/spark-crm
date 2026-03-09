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
import { Skeleton } from "@/components/ui/skeleton";

import { useConversionFunnel } from "@/hooks";

const conversionFunnelConfig: ChartConfig = {
  count: { label: "Count", color: "#06B6D4" },
};

export const ConversionFunnelWidget = () => {
  const { data, isPending } = useConversionFunnel();

  if (isPending) return <ConversionFunnelSkeleton />;

  if (!data) return null;

  const conversionFunnelData = data.data;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Conversion Funnel</CardTitle>
        <CardDescription>Lead-to-deal conversion stages</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 pb-4">
        <ChartContainer
          config={conversionFunnelConfig}
          className="h-full w-full"
        >
          <BarChart
            layout="vertical"
            data={conversionFunnelData}
            margin={{ left: 12, right: 24 }}
          >
            <CartesianGrid
              horizontal={false}
              strokeDasharray="3 3"
              className="stroke-border"
            />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              type="category"
              dataKey="stage"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={70}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="#06B6D4" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

const ConversionFunnelSkeleton = () => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-52" />
      </CardHeader>
      <CardContent className="flex-1 min-h-0 pb-4">
        <Skeleton className="h-full w-full" />
      </CardContent>
    </Card>
  );
};
