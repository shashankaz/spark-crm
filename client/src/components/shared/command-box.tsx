import { useState } from "react";
import { useNavigate } from "react-router";
import {
  LayoutDashboard,
  Building,
  Building2,
  UserPlus,
  Handshake,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useHotkey } from "@tanstack/react-hotkeys";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

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

export const CommandBox = () => {
  const [open, setOpen] = useState(false);

  const { user } = useUser();

  const navigate = useNavigate();

  useHotkey("Mod+K", () => {
    setOpen(true);
  });

  if (!user) return null;

  const base = user.role === "super_admin" ? "/admin" : "/dashboard";
  const buildHref = (path: string) => {
    if (!path || path === "/") {
      return base;
    }
    return `${base}${path.startsWith("/") ? path : `/${path}`}`;
  };

  const getLinks = (): NavLink[] => {
    const roleLinks = allLinks.roles[user.role] || [];
    return [...allLinks.base, ...roleLinks];
  };

  const handleCommandSelect = (href: string) => {
    setOpen(false);
    navigate(href);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Tabs">
            {getLinks().map(({ to, label, icon: Icon }) => {
              const href = buildHref(to);
              return (
                <CommandItem
                  key={href}
                  onSelect={() => handleCommandSelect(href)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {label}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
};

export default CommandBox;
