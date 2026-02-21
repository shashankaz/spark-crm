import { Building2, Users, CreditCard, TrendingUp } from "lucide-react";

export const stats = [
  {
    title: "Total Tenants",
    value: "128",
    change: "+14%",
    trend: "up",
    description: "vs last month",
    icon: Building2,
  },
  {
    title: "Total Users",
    value: "3,842",
    change: "+9%",
    trend: "up",
    description: "vs last month",
    icon: Users,
  },
  {
    title: "Monthly Revenue",
    value: "$48,290",
    change: "+21%",
    trend: "up",
    description: "vs last month",
    icon: CreditCard,
  },
  {
    title: "Paid Plans",
    value: "94",
    change: "-2%",
    trend: "down",
    description: "vs last month",
    icon: TrendingUp,
  },
];

export const recentTenants = [
  {
    id: "1",
    name: "Acme Corp",
    email: "admin@acmecorp.com",
    plan: "Enterprise",
    city: "New York",
    country: "United States",
    createdAt: "2026-02-18",
  },
  {
    id: "2",
    name: "Globex Inc",
    email: "contact@globex.com",
    plan: "Pro",
    city: "London",
    country: "United Kingdom",
    createdAt: "2026-02-17",
  },
  {
    id: "3",
    name: "Initech LLC",
    email: "info@initech.com",
    plan: "Basic",
    city: "San Francisco",
    country: "United States",
    createdAt: "2026-02-16",
  },
  {
    id: "4",
    name: "Umbrella Ltd",
    email: "support@umbrella.com",
    plan: "Free",
    city: "Mumbai",
    country: "India",
    createdAt: "2026-02-15",
  },
  {
    id: "5",
    name: "Hooli Technologies",
    email: "hello@hooli.com",
    plan: "Pro",
    city: "Palo Alto",
    country: "United States",
    createdAt: "2026-02-14",
  },
];

export const planDistribution = [
  { plan: "Free", count: 34, color: "bg-slate-400" },
  { plan: "Basic", count: 28, color: "bg-blue-400" },
  { plan: "Pro", count: 42, color: "bg-violet-500" },
  { plan: "Enterprise", count: 24, color: "bg-amber-500" },
];
