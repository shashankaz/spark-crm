import { Helmet } from "react-helmet-async";

import { StatsSection } from "@/components/admin-dashboard/stats-section";
import { TenantsStats } from "@/components/admin-dashboard/tenants-stats";
import { Heading } from "@/components/shared/typography/heading";
import { Description } from "@/components/shared/typography/description";

const AdminDashboard = () => {
  return (
    <>
      <Helmet>
        <title>Admin Dashboard</title>
        <meta name="description" content="Super admin overview dashboard" />
      </Helmet>

      <div className="space-y-4">
        <div className="border-b pb-4">
          <Heading title="Admin Dashboard" />
          <Description description="Platform-wide overview — tenants, users, and revenue at a glance." />
        </div>

        <StatsSection />

        <TenantsStats />
      </div>
    </>
  );
};

export default AdminDashboard;
