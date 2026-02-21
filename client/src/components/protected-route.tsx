import { Navigate, Outlet } from "react-router";

import LoadingPage from "@/components/shared/loading";

import { useUser } from "@/hooks/use-user";

import type { User } from "@/types";

type Role = User["role"];

interface ProtectedRouteProps {
  allowedRoles: Role[];
}

const roleHomeMap: Record<Role, string> = {
  super_admin: "/admin",
  admin: "/dashboard",
  user: "/dashboard",
};

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, loading } = useUser();

  if (loading) return <LoadingPage />;

  if (!user) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={roleHomeMap[user.role]} replace />;
  }

  return <Outlet />;
};
