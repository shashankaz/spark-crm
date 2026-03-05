import { Helmet } from "react-helmet-async";

import { Heading } from "@/components/shared/typography/heading";
import { Description } from "@/components/shared/typography/description";
import { DashboardGrid } from "@/components/dashboard/dashboard-grid";

import { useDashboardStats } from "@/hooks";

const DashboardPage = () => {
  const { data, isPending } = useDashboardStats();

  return (
    <>
      <Helmet>
        <title>Dashboard</title>
        <meta name="description" content="Welcome to your CRM dashboard" />
      </Helmet>

      <div className="space-y-4">
        <div className="border-b pb-4">
          <Heading title="Dashboard" />
          <Description description="Welcome back! Here's what's happening in your CRM." />
        </div>

        <DashboardGrid
          stats={data?.stats}
          recentLeads={data?.recentLeads}
          recentDeals={data?.recentDeals}
          isLoading={isPending}
        />
      </div>
    </>
  );
};

export default DashboardPage;
