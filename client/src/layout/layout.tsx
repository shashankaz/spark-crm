import { Outlet, useNavigate } from "react-router";
import { useHotkey } from "@tanstack/react-hotkeys";
import { useSidebar } from "@/components/ui/sidebar";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { AppSidebar } from "@/components/shared/navigation/app-sidebar";
import { SiteHeader } from "@/components/shared/navigation/site-header";

import { useUser } from "@/hooks/use-user";

const LayoutInner = () => {
  const navigate = useNavigate();

  const { toggleSidebar } = useSidebar();
  const { user } = useUser();

  const base = user?.role === "super_admin" ? "/admin" : "/dashboard";

  useHotkey("Mod+B", () => toggleSidebar());
  useHotkey("Mod+/", () => navigate(`${base}/shortcuts`));
  useHotkey("Mod+.", () => navigate(`${base}/profile`));

  useHotkey("Mod+Shift+D", () => navigate(base));
  useHotkey("Mod+Shift+L", () => navigate(`${base}/leads`));
  useHotkey("Mod+Shift+O", () => navigate(`${base}/organizations`));
  useHotkey("Mod+Shift+C", () => navigate(`${base}/contacts`));
  useHotkey("Mod+Shift+X", () => navigate(`${base}/deals`));
  useHotkey("Mod+Shift+W", () => navigate(`${base}/workflows`));
  useHotkey("Mod+Shift+G", () => navigate(`${base}/groups`));

  useHotkey("Mod+Shift+U", () => {
    if (user?.role === "admin") navigate(`${base}/users`);
  });

  useHotkey("Mod+Shift+T", () => {
    if (user?.role === "super_admin") {
      navigate(`${base}/tenants`);
    } else {
      navigate(`${base}/tasks`);
    }
  });

  return (
    <SidebarInset className="min-w-0">
      <SiteHeader />
      <div className="w-full overflow-hidden p-4">
        <Outlet />
      </div>
    </SidebarInset>
  );
};

const UserLayout = () => {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <LayoutInner />
    </SidebarProvider>
  );
};

export default UserLayout;
