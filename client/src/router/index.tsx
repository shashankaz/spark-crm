import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";

import { LoadingPage } from "@/components/shared/loading";

import { ProtectedRoute } from "@/components/protected-route";
import { CommandBox } from "@/components/shared/command-box";

const LandingPage = lazy(() => import("@/pages/landing-page"));
const Login = lazy(() => import("@/pages/auth/login"));
const Register = lazy(() => import("@/pages/auth/register"));
const About = lazy(() => import("@/pages/about"));
const Contact = lazy(() => import("@/pages/contact"));

const Layout = lazy(() => import("@/layout/layout"));

const Dashboard = lazy(() => import("@/pages/dashboard"));
const Organizations = lazy(() => import("@/pages/organizations"));
const OrganizationsEditPage = lazy(() => import("@/pages/organizations/edit"));
const Leads = lazy(() => import("@/pages/leads"));
const LeadsEditPage = lazy(() => import("@/pages/leads/edit"));
const Deals = lazy(() => import("@/pages/deals"));
const DealsEditPage = lazy(() => import("@/pages/deals/edit"));
const Users = lazy(() => import("@/pages/users"));
const UsersEditPage = lazy(() => import("@/pages/users/edit"));

const AdminDashboard = lazy(() => import("@/pages/admin-dashboard"));
const Tenants = lazy(() => import("@/pages/tenants"));
const TenantsEditPage = lazy(() => import("@/pages/tenants/edit"));

const Profile = lazy(() => import("@/pages/profile"));

const NotFound = lazy(() => import("@/pages/not-found"));

export const ReactRouter = () => {
  return (
    <Router>
      <Suspense fallback={<LoadingPage />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          <Route
            path="/dashboard"
            element={<ProtectedRoute allowedRoles={["admin", "user"]} />}
          >
            <Route element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="organizations" element={<Organizations />} />
              <Route
                path="organizations/:organizationId/edit"
                element={<OrganizationsEditPage />}
              />
              <Route path="leads" element={<Leads />} />
              <Route path="leads/:leadId/edit" element={<LeadsEditPage />} />
              <Route path="deals" element={<Deals />} />
              <Route path="deals/:dealId/edit" element={<DealsEditPage />} />
              <Route path="users" element={<Users />} />
              <Route path="users/:userId/edit" element={<UsersEditPage />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Route>

          <Route
            path="/admin"
            element={<ProtectedRoute allowedRoles={["super_admin"]} />}
          >
            <Route element={<Layout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="tenants" element={<Tenants />} />
              <Route
                path="tenants/:tenantId/edit"
                element={<TenantsEditPage />}
              />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>

        <CommandBox />
      </Suspense>
    </Router>
  );
};
