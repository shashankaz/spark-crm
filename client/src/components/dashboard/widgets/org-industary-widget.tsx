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

import { useOrgIndustry } from "@/hooks";

const orgIndustryConfig: ChartConfig = {
  count: { label: "Organizations", color: "#06B6D4" },
  technology: { label: "Technology", color: "#3B82F6" },
  finance: { label: "Finance", color: "#10B981" },
  healthcare: { label: "Healthcare", color: "#F59E0B" },
  education: { label: "Education", color: "#8B5CF6" },
  retail: { label: "Retail", color: "#F97316" },
  manufacturing: { label: "Manufacturing", color: "#6366F1" },
  "real estate": { label: "Real Estate", color: "#EC4899" },
  other: { label: "Other", color: "#6B7280" },
};

const industryFills: Record<string, string> = {
  technology: "#3B82F6",
  finance: "#10B981",
  healthcare: "#F59E0B",
  education: "#8B5CF6",
  retail: "#F97316",
  manufacturing: "#6366F1",
  "real estate": "#EC4899",
  other: "#6B7280",
};

export const OrgIndustryWidget = () => {
  const { data, isPending } = useOrgIndustry();

  if (isPending) return <OrgIndustrySkeleton />;

  if (!data) return null;

  const orgIndustryData = data.data;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Organizations by Industry</CardTitle>
        <CardDescription>
          Distribution across industry verticals
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 pb-4">
        <ChartContainer config={orgIndustryConfig} className="h-full w-full">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={orgIndustryData}
              dataKey="count"
              nameKey="industry"
              outerRadius="75%"
              paddingAngle={2}
            >
              {orgIndustryData.map((entry) => (
                <Cell
                  key={entry.industry}
                  fill={
                    industryFills[entry.industry.toLowerCase()] ?? "#6B7280"
                  }
                />
              ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="industry" />}
              className="flex-wrap gap-2 justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

const OrgIndustrySkeleton = () => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-52" />
      </CardHeader>
      <CardContent className="flex-1 min-h-0 pb-4">
        <Skeleton className="h-full w-full" />
      </CardContent>
    </Card>
  );
};
