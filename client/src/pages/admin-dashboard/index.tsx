import { Helmet } from "react-helmet-async";

import { Heading } from "@/components/shared/typography/heading";
import { Description } from "@/components/shared/typography/description";
import { AdminDashboardGrid } from "@/components/admin-dashboard/admin-dashboard-grid";

import { useTenantDashboardStats } from "@/hooks";

const AdminDashboard = () => {
  const { data, isPending } = useTenantDashboardStats();

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

        <AdminDashboardGrid
          stats={data?.stats}
          recentTenants={data?.recentTenants}
          planDistribution={data?.planDistribution}
          isLoading={isPending}
        />
      </div>
    </>
  );
};

export default AdminDashboard;
