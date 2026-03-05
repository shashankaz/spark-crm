import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { GridStack } from "gridstack";
import type { GridStackWidget } from "gridstack";
import {
  GripHorizontal,
  RotateCcw,
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  TrendingUp,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  AdminStatWidget,
  PlanDistributionWidget,
  RecentTenantsWidget,
} from "./widgets";

import type {
  TenantDashboardStat,
  TenantRecentTenant,
  TenantPlanDistribution,
} from "@/types/services";

type StatsData = {
  totalTenants: TenantDashboardStat;
  totalUsers: TenantDashboardStat;
  monthlyRevenue: TenantDashboardStat;
  paidPlans: TenantDashboardStat;
};

type Props = {
  stats?: StatsData;
  recentTenants?: TenantRecentTenant[];
  planDistribution?: TenantPlanDistribution[];
  isLoading?: boolean;
};

const STORAGE_KEY = "crm-admin-dashboard-layout";

const DEFAULT_LAYOUT: GridStackWidget[] = [
  { id: "stat-tenants", x: 0, y: 0, w: 3, h: 3, minH: 3, minW: 2 },
  { id: "stat-users", x: 3, y: 0, w: 3, h: 3, minH: 3, minW: 2 },
  { id: "stat-revenue", x: 6, y: 0, w: 3, h: 3, minH: 3, minW: 2 },
  { id: "stat-paid-plans", x: 9, y: 0, w: 3, h: 3, minH: 3, minW: 2 },
  { id: "recent-tenants", x: 0, y: 3, w: 8, h: 7, minH: 4, minW: 4 },
  { id: "plan-distribution", x: 8, y: 3, w: 4, h: 7, minH: 4, minW: 3 },
];

const getInitialLayout: () => GridStackWidget[] = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as GridStackWidget[];
      const ids = new Set(parsed.map((w) => w.id));
      if (DEFAULT_LAYOUT.every((w) => ids.has(w.id))) return parsed;
    }
  } catch {
    // ignore
  }

  return DEFAULT_LAYOUT;
};

export const AdminDashboardGrid = ({
  stats,
  recentTenants,
  planDistribution,
  isLoading,
}: Props) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInstance = useRef<GridStack | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const initialLayout = useMemo(() => getInitialLayout(), []);

  useEffect(() => {
    if (!gridRef.current) return;

    const grid = GridStack.init(
      {
        column: 12,
        cellHeight: 70,
        margin: 8,
        animate: true,
        float: false,
        handle: ".gs-drag-handle",
        resizable: { handles: "e,s,se,sw,w" },
      },
      gridRef.current,
    );

    gridInstance.current = grid;
    grid.setStatic(true);

    grid.on("change", () => {
      const saved = grid.save(false) as GridStackWidget[];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    });

    return () => {
      grid.destroy(false);
      gridInstance.current = null;
    };
  }, []);

  const toggleEdit = useCallback(() => {
    const grid = gridInstance.current;
    if (!grid) return;
    setIsEditing((prev) => {
      grid.setStatic(prev);
      return !prev;
    });
  }, []);

  const resetLayout = useCallback(() => {
    const grid = gridInstance.current;
    if (!grid) return;
    grid.load(DEFAULT_LAYOUT);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex justify-end items-center gap-2">
        {isEditing && (
          <>
            <p className="text-xs text-muted-foreground mr-auto">
              Drag widgets to reorder · resize from edges
            </p>
            <Button variant="outline" size="sm" onClick={resetLayout}>
              <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
              Reset
            </Button>
          </>
        )}

        <Button
          variant={isEditing ? "default" : "outline"}
          size="sm"
          onClick={toggleEdit}
        >
          <LayoutDashboard className="h-3.5 w-3.5 mr-1.5" />
          {isEditing ? "Done" : "Customize"}
        </Button>

        <Button variant="secondary" size="sm">
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Add Widget
        </Button>
      </div>

      <div ref={gridRef} className="grid-stack">
        {initialLayout.map((item) => (
          <div
            key={item.id}
            className="grid-stack-item"
            gs-id={item.id}
            gs-x={String(item.x)}
            gs-y={String(item.y)}
            gs-w={String(item.w)}
            gs-h={String(item.h)}
            gs-min-h={String(item.minH ?? 3)}
            gs-min-w={String(item.minW ?? 2)}
          >
            <div className="grid-stack-item-content flex flex-col rounded-xl overflow-hidden border bg-card shadow-sm">
              {isEditing && (
                <div className="gs-drag-handle flex items-center justify-center gap-1.5 h-7 shrink-0 bg-muted/60 border-b cursor-grab active:cursor-grabbing select-none">
                  <GripHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-[11px] text-muted-foreground">
                    drag to move
                  </span>
                </div>
              )}

              <div className="flex-1 min-h-0 overflow-auto p-0">
                {item.id === "stat-tenants" && (
                  <AdminStatWidget
                    title="Total Tenants"
                    icon={Building2}
                    stat={stats?.totalTenants}
                    isLoading={isLoading}
                  />
                )}

                {item.id === "stat-users" && (
                  <AdminStatWidget
                    title="Total Users"
                    icon={Users}
                    stat={stats?.totalUsers}
                    isLoading={isLoading}
                  />
                )}

                {item.id === "stat-revenue" && (
                  <AdminStatWidget
                    title="Monthly Revenue"
                    icon={CreditCard}
                    stat={stats?.monthlyRevenue}
                    isMonetary
                    isLoading={isLoading}
                  />
                )}

                {item.id === "stat-paid-plans" && (
                  <AdminStatWidget
                    title="Paid Plans"
                    icon={TrendingUp}
                    stat={stats?.paidPlans}
                    isLoading={isLoading}
                  />
                )}

                {item.id === "recent-tenants" && (
                  <RecentTenantsWidget
                    recentTenants={recentTenants}
                    isLoading={isLoading}
                  />
                )}

                {item.id === "plan-distribution" && (
                  <PlanDistributionWidget
                    planDistribution={planDistribution}
                    isLoading={isLoading}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
