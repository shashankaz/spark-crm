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
import { Skeleton } from "@/components/ui/skeleton";

import { useDealWinRate } from "@/hooks";

const dealWinRateConfig: ChartConfig = {
  "Closed Won": { label: "Closed Won", color: "#22C55E" },
  "In Progress": { label: "In Progress", color: "#3B82F6" },
  "Closed Lost": { label: "Closed Lost", color: "#EF4444" },
};

const winRateColors: Record<string, string> = {
  "Closed Won": "#22C55E",
  "In Progress": "#3B82F6",
  "Closed Lost": "#EF4444",
};

export const DealWinRateWidget = () => {
  const { data, isPending } = useDealWinRate();

  if (isPending) return <DealWinRateSkeleton />;

  if (!data) return null;

  const dealWinRateData = data.data;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Deal Win Rate</CardTitle>
        <CardDescription>Current deal outcome distribution</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 pb-2 flex flex-col">
        <ChartContainer
          config={dealWinRateConfig}
          className="flex-1 min-h-0 w-full"
        >
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
                <Cell
                  key={entry.name}
                  fill={winRateColors[entry.name] ?? "#6B7280"}
                />
              ))}
            </RadialBar>
          </RadialBarChart>
        </ChartContainer>
        <div className="flex flex-wrap justify-center gap-4 pb-2">
          {Object.entries(dealWinRateConfig).map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ background: cfg.color as string }}
              />
              <span className="text-xs text-muted-foreground">
                {cfg.label as string}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const DealWinRateSkeleton = () => {
  return (
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
};
