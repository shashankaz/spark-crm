import { Users, TrendingUp, Building2, Handshake } from "lucide-react";

export const stats = [
  {
    title: "Total Leads",
    value: "1,284",
    change: "+12%",
    trend: "up",
    description: "vs last month",
    icon: TrendingUp,
  },
  {
    title: "Total Deals",
    value: "342",
    change: "+8%",
    trend: "up",
    description: "vs last month",
    icon: Handshake,
  },
  {
    title: "Organizations",
    value: "87",
    change: "-3%",
    trend: "down",
    description: "vs last month",
    icon: Building2,
  },
  {
    title: "Total Users",
    value: "24",
    change: "+2%",
    trend: "up",
    description: "vs last month",
    icon: Users,
  },
];

export const recentLeads = [
  {
    id: "1",
    name: "John Doe",
    organization: "Acme Corp",
    email: "john.doe@example.com",
    score: 85,
    updatedAt: "2026-02-18",
  },
  {
    id: "2",
    name: "Jane Smith",
    organization: "Globex Inc",
    email: "jane.smith@example.com",
    score: 75,
    updatedAt: "2026-02-17",
  },
  {
    id: "3",
    name: "Carlos Martinez",
    organization: "Initech",
    email: "carlos.martinez@initech.com",
    score: 92,
    updatedAt: "2026-02-16",
  },
  {
    id: "4",
    name: "Priya Sharma",
    organization: "Umbrella Corp",
    email: "priya.sharma@umbrella.com",
    score: 68,
    updatedAt: "2026-02-15",
  },
  {
    id: "5",
    name: "Liam O'Brien",
    organization: "Stark Industries",
    email: "liam.obrien@stark.com",
    score: 81,
    updatedAt: "2026-02-14",
  },
];

export const recentDeals = [
  {
    id: "1",
    title: "Enterprise License",
    organization: "Acme Corp",
    value: "$48,000",
    status: "Won",
    updatedAt: "2026-02-18",
  },
  {
    id: "2",
    title: "Starter Package",
    organization: "Globex Inc",
    value: "$12,500",
    status: "In Progress",
    updatedAt: "2026-02-17",
  },
  {
    id: "3",
    title: "Annual Subscription",
    organization: "Initech",
    value: "$29,000",
    status: "Won",
    updatedAt: "2026-02-16",
  },
  {
    id: "4",
    title: "Consulting Services",
    organization: "Umbrella Corp",
    value: "$7,800",
    status: "Lost",
    updatedAt: "2026-02-15",
  },
  {
    id: "5",
    title: "Premium Support",
    organization: "Stark Industries",
    value: "$5,200",
    status: "In Progress",
    updatedAt: "2026-02-14",
  },
];
