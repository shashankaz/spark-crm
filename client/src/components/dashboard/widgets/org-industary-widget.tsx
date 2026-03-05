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

const orgIndustryData = [
  { industry: "technology", count: 47, fill: "var(--color-technology)" },
  { industry: "finance", count: 31, fill: "var(--color-finance)" },
  { industry: "healthcare", count: 24, fill: "var(--color-healthcare)" },
  { industry: "education", count: 16, fill: "var(--color-education)" },
  { industry: "retail", count: 19, fill: "var(--color-retail)" },
  { industry: "manufacturing", count: 21, fill: "var(--color-manufacturing)" },
  { industry: "real estate", count: 18, fill: "var(--color-real-estate)" },
  { industry: "other", count: 22, fill: "var(--color-other)" },
];

const orgIndustryConfig: ChartConfig = {
  count: { label: "Organizations" },
  technology: { label: "Technology", color: "hsl(var(--chart-1))" },
  finance: { label: "Finance", color: "hsl(var(--chart-2))" },
  healthcare: { label: "Healthcare", color: "hsl(var(--chart-3))" },
  education: { label: "Education", color: "hsl(var(--chart-4))" },
  retail: { label: "Retail", color: "hsl(var(--chart-5))" },
  manufacturing: { label: "Manufacturing", color: "hsl(var(--chart-6))" },
  "real estate": { label: "Real Estate", color: "hsl(var(--chart-7))" },
  other: { label: "Other", color: "hsl(221, 83%, 53%)" },
};

export const OrgIndustryWidget = () => (
  <Card className="h-full flex flex-col">
    <CardHeader className="pb-2">
      <CardTitle className="text-base">Organizations by Industry</CardTitle>
      <CardDescription>Distribution across industry verticals</CardDescription>
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
              <Cell key={entry.industry} fill={entry.fill} />
            ))}
          </Pie>
          <ChartLegend
            content={<ChartLegendContent nameKey="industry" />}
            className="-translate-y-2 flex-wrap gap-2 *:basis-1/3 *:justify-center"
          />
        </PieChart>
      </ChartContainer>
    </CardContent>
  </Card>
);
