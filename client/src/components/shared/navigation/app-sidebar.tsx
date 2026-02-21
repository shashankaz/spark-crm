import { Link, useLocation } from "react-router";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Building,
  Building2,
  UserPlus,
  Handshake,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { cn } from "@/lib/utils";

import { NavUser } from "./nav-user";
import { useUser } from "@/hooks/use-user";

interface NavLink {
  to: string;
  label: string;
  icon: LucideIcon;
}

const allLinks: {
  base: NavLink[];
  roles: Record<string, NavLink[]>;
} = {
  base: [],
  roles: {
    super_admin: [
      { to: "", label: "Dashboard", icon: LayoutDashboard },
      { to: "/tenants", label: "Tenants", icon: Building },
    ],
    admin: [
      { to: "", label: "Dashboard", icon: LayoutDashboard },
      { to: "/organizations", label: "Organizations", icon: Building2 },
      { to: "/leads", label: "Leads", icon: UserPlus },
      { to: "/deals", label: "Deals", icon: Handshake },
      { to: "/users", label: "Users", icon: Users },
    ],
    user: [
      { to: "", label: "Dashboard", icon: LayoutDashboard },
      { to: "/organizations", label: "Organizations", icon: Building2 },
      { to: "/leads", label: "Leads", icon: UserPlus },
      { to: "/deals", label: "Deals", icon: Handshake },
    ],
  },
};

export const AppSidebar = ({
  collapsible = "icon",
  className,
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const { state, isMobile, setOpenMobile } = useSidebar();
  const location = useLocation();

  const { user } = useUser();

  if (!user) {
    return null;
  }

  const collapsed = state === "collapsed";

  const base = user.role === "super_admin" ? "/admin" : "/dashboard";

  const buildHref = (path: string) => {
    if (!path || path === "/") {
      return base;
    }

    return `${base}${path.startsWith("/") ? path : `/${path}`}`;
  };

  const isActive = (href: string) => location.pathname === href;

  const getLinks = (): NavLink[] => {
    const roleLinks = allLinks.roles[user.role] || [];
    return [...allLinks.base, ...roleLinks];
  };

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const renderLinks = (links: NavLink[]) =>
    links.map(({ to, label, icon: Icon }) => {
      const href = buildHref(to);
      const active = isActive(href);

      return (
        <SidebarMenuItem key={href}>
          <SidebarMenuButton
            tooltip={collapsed ? label : undefined}
            isActive={active}
            asChild
          >
            <Link
              to={href}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all"
              onClick={handleNavClick}
            >
              <Icon className="h-4 w-4 min-w-4" />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    });

  return (
    <Sidebar
      collapsible={collapsible}
      className={cn("h-full", className)}
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link to={base}>
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:p-1.5! hover:bg-transparent focus:bg-transparent focus:ring-0"
              >
                {!collapsed && (
                  <div>
                    <span className="text-2xl text-primary select-none font-playfair-display font-medium py-10">
                      Spark
                    </span>
                  </div>
                )}
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent style={{ scrollbarWidth: "none" }}>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>{renderLinks(getLinks())}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
};
