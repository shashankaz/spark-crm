import { Helmet } from "react-helmet-async";

import { Stats } from "@/components/dashboard/stats";
import { RecentLeadsDeals } from "@/components/dashboard/recent-leads-deals";
import { Heading } from "@/components/shared/typography/heading";
import { Description } from "@/components/shared/typography/description";

const DashboardPage = () => {
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

        <Stats />

        <RecentLeadsDeals />
      </div>
    </>
  );
};

export default DashboardPage;
