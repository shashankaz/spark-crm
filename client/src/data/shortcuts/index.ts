export type ShortcutRole = "super_admin" | "admin" | "user" | "all";

export interface Shortcut {
  keys: string[];
  windowsKeys: string[];
  description: string;
  context: string;
  roles: ShortcutRole[];
}

export const shortcuts: Shortcut[] = [
  {
    keys: ["⌘", "K"],
    windowsKeys: ["Ctrl", "K"],
    description: "Open Command Menu",
    context: "Global",
    roles: ["all"],
  },
  {
    keys: ["⌘", "B"],
    windowsKeys: ["Ctrl", "B"],
    description: "Toggle Sidebar",
    context: "Global",
    roles: ["all"],
  },
  {
    keys: ["⌘", "/"],
    windowsKeys: ["Ctrl", "/"],
    description: "Go to Shortcuts Page",
    context: "Global",
    roles: ["all"],
  },
  {
    keys: ["⌘", "."],
    windowsKeys: ["Ctrl", "."],
    description: "Go to Profile",
    context: "Global",
    roles: ["all"],
  },
  {
    keys: ["⌘", "Shift", "D"],
    windowsKeys: ["Ctrl", "Shift", "D"],
    description: "Go to Dashboard",
    context: "Navigation",
    roles: ["admin", "user"],
  },
  {
    keys: ["⌘", "Shift", "L"],
    windowsKeys: ["Ctrl", "Shift", "L"],
    description: "Go to Leads",
    context: "Navigation",
    roles: ["admin", "user"],
  },
  {
    keys: ["⌘", "Shift", "O"],
    windowsKeys: ["Ctrl", "Shift", "O"],
    description: "Go to Organizations",
    context: "Navigation",
    roles: ["admin", "user"],
  },
  {
    keys: ["⌘", "Shift", "C"],
    windowsKeys: ["Ctrl", "Shift", "C"],
    description: "Go to Contacts",
    context: "Navigation",
    roles: ["admin", "user"],
  },
  {
    keys: ["⌘", "Shift", "X"],
    windowsKeys: ["Ctrl", "Shift", "X"],
    description: "Go to Deals",
    context: "Navigation",
    roles: ["admin", "user"],
  },
  {
    keys: ["⌘", "Shift", "T"],
    windowsKeys: ["Ctrl", "Shift", "T"],
    description: "Go to Tasks",
    context: "Navigation",
    roles: ["admin", "user"],
  },
  {
    keys: ["⌘", "Shift", "W"],
    windowsKeys: ["Ctrl", "Shift", "W"],
    description: "Go to Workflows",
    context: "Navigation",
    roles: ["admin", "user"],
  },
  {
    keys: ["⌘", "Shift", "G"],
    windowsKeys: ["Ctrl", "Shift", "G"],
    description: "Go to Groups",
    context: "Navigation",
    roles: ["admin", "user"],
  },
  {
    keys: ["⌘", "Shift", "U"],
    windowsKeys: ["Ctrl", "Shift", "U"],
    description: "Go to Users",
    context: "Navigation",
    roles: ["admin"],
  },
  {
    keys: ["⌘", "Shift", "D"],
    windowsKeys: ["Ctrl", "Shift", "D"],
    description: "Go to Dashboard",
    context: "Navigation",
    roles: ["super_admin"],
  },
  {
    keys: ["⌘", "Shift", "T"],
    windowsKeys: ["Ctrl", "Shift", "T"],
    description: "Go to Tenants",
    context: "Navigation",
    roles: ["super_admin"],
  },
  {
    keys: ["⌘", "L"],
    windowsKeys: ["Ctrl", "L"],
    description: "Create New Lead",
    context: "Leads",
    roles: ["admin", "user"],
  },
  {
    keys: ["⌘", "E"],
    windowsKeys: ["Ctrl", "E"],
    description: "Create New Contact",
    context: "Contacts",
    roles: ["admin", "user"],
  },
  {
    keys: ["⌘", "O"],
    windowsKeys: ["Ctrl", "O"],
    description: "Create New Organization",
    context: "Organizations",
    roles: ["admin", "user"],
  },
  {
    keys: ["⌘", "T"],
    windowsKeys: ["Ctrl", "T"],
    description: "Create New Task",
    context: "Tasks",
    roles: ["admin", "user"],
  },
  {
    keys: ["⌘", "U"],
    windowsKeys: ["Ctrl", "U"],
    description: "Create New User",
    context: "Users",
    roles: ["admin"],
  },
  {
    keys: ["⌘", "W"],
    windowsKeys: ["Ctrl", "W"],
    description: "Create New Workflow",
    context: "Workflows",
    roles: ["admin", "user"],
  },
  {
    keys: ["⌘", "G"],
    windowsKeys: ["Ctrl", "G"],
    description: "Create New Group",
    context: "Groups",
    roles: ["admin", "user"],
  },
  {
    keys: ["⌘", "T"],
    windowsKeys: ["Ctrl", "T"],
    description: "Create New Tenant",
    context: "Tenants",
    roles: ["super_admin"],
  },
];

export const getShortcutsForRole = (
  role: "super_admin" | "admin" | "user",
): Shortcut[] =>
  shortcuts.filter((s) => s.roles.includes("all") || s.roles.includes(role));
