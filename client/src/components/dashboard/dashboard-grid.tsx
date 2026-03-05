import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { GridStack } from "gridstack";
import type { GridStackWidget } from "gridstack";
import {
  GripHorizontal,
  RotateCcw,
  LayoutDashboard,
  TrendingUp,
  Handshake,
  Building2,
  Users,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  CallActivityWidget,
  ConversionFunnelWidget,
  DealPipelineWidget,
  DealWinRateWidget,
  LeadScoreWidget,
  LeadSourcesWidget,
  LeadStatusWidget,
  MonthlyRevenueWidget,
  OrgIndustryWidget,
  RecentDealsWidget,
  RecentLeadsWidget,
  RevenueTargetWidget,
  StatCardWidget,
} from "./widgets";
import { AddWidgetDialog } from "./add-widget-dialog";
import {
  CUSTOM_WIDGETS,
  type CustomWidgetId,
  type WidgetMeta,
} from "./widget-registry";

import type {
  DashboardStat,
  DashboardRecentLead,
  DashboardRecentDeal,
} from "@/types/services";

type StatsData = {
  totalLeads: DashboardStat;
  totalDeals: DashboardStat;
  totalOrganizations: DashboardStat;
  totalUsers: DashboardStat;
};

type DashboardGridProps = {
  stats?: StatsData;
  recentLeads?: DashboardRecentLead[];
  recentDeals?: DashboardRecentDeal[];
  isLoading?: boolean;
};

const STORAGE_KEY = "crm-user-dashboard-layout";
const CUSTOM_WIDGETS_KEY = "crm-user-dashboard-custom-widgets";

const DEFAULT_LAYOUT: GridStackWidget[] = [
  { id: "stat-leads", x: 0, y: 0, w: 3, h: 3, minH: 3, minW: 2 },
  { id: "stat-deals", x: 3, y: 0, w: 3, h: 3, minH: 3, minW: 2 },
  { id: "stat-organizations", x: 6, y: 0, w: 3, h: 3, minH: 3, minW: 2 },
  { id: "stat-users", x: 9, y: 0, w: 3, h: 3, minH: 3, minW: 2 },
  { id: "recent-leads", x: 0, y: 3, w: 6, h: 7, minH: 4, minW: 3 },
  { id: "recent-deals", x: 6, y: 3, w: 6, h: 7, minH: 4, minW: 3 },
];

const getSavedCustomWidgetIds = (): CustomWidgetId[] => {
  try {
    const saved = localStorage.getItem(CUSTOM_WIDGETS_KEY);
    if (saved) return JSON.parse(saved) as CustomWidgetId[];
  } catch {
    // ignore
  }

  return [];
};

const getInitialLayout = (customIds: CustomWidgetId[]): GridStackWidget[] => {
  const allWidgets: GridStackWidget[] = [
    ...DEFAULT_LAYOUT,
    ...customIds.map((id) => {
      const meta = CUSTOM_WIDGETS.find((w) => w.id === id)!;
      return {
        id,
        x: 0,
        y: 999,
        w: meta.defaultSize.w,
        h: meta.defaultSize.h,
        minW: meta.defaultSize.minW,
        minH: meta.defaultSize.minH,
      };
    }),
  ];

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as GridStackWidget[];
      const savedIds = new Set(parsed.map((w) => w.id));
      if (allWidgets.every((w) => savedIds.has(w.id))) {
        return parsed.filter(
          (w) =>
            DEFAULT_LAYOUT.some((d) => d.id === w.id) ||
            customIds.includes(w.id as CustomWidgetId),
        );
      }
    }
  } catch {
    // ignore
  }

  return allWidgets;
};

export const DashboardGrid = ({
  stats,
  recentLeads,
  recentDeals,
  isLoading,
}: DashboardGridProps) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInstance = useRef<GridStack | null>(null);
  const isEditingRef = useRef(false);

  const [isEditing, setIsEditing] = useState(false);
  const [customWidgetIds, setCustomWidgetIds] = useState<CustomWidgetId[]>(
    getSavedCustomWidgetIds,
  );

  const fullLayout = useMemo(
    () => getInitialLayout(customWidgetIds),
    [customWidgetIds],
  );

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
    grid.setStatic(!isEditingRef.current);

    grid.on("change", () => {
      const saved = grid.save(false) as GridStackWidget[];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    });

    return () => {
      grid.destroy(false);
      gridInstance.current = null;
    };
  }, [customWidgetIds]);

  useEffect(() => {
    isEditingRef.current = isEditing;
    gridInstance.current?.setStatic(!isEditing);
  }, [isEditing]);

  const toggleEdit = useCallback(() => {
    setIsEditing((prev) => !prev);
  }, []);

  const resetLayout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CUSTOM_WIDGETS_KEY);
    if (customWidgetIds.length === 0) {
      gridInstance.current?.load(DEFAULT_LAYOUT);
    } else {
      setCustomWidgetIds([]);
    }
  }, [customWidgetIds.length]);

  const handleAddWidget = useCallback(
    (widget: WidgetMeta) => {
      const grid = gridInstance.current;
      if (grid) {
        const current = grid.save(false) as GridStackWidget[];
        const newItem: GridStackWidget = {
          id: widget.id,
          x: 0,
          y: 999,
          w: widget.defaultSize.w,
          h: widget.defaultSize.h,
          minW: widget.defaultSize.minW,
          minH: widget.defaultSize.minH,
        };
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify([...current, newItem]),
        );
      }
      const newIds = [...customWidgetIds, widget.id];
      localStorage.setItem(CUSTOM_WIDGETS_KEY, JSON.stringify(newIds));
      setCustomWidgetIds(newIds);
    },
    [customWidgetIds],
  );

  const handleRemoveWidget = useCallback(
    (id: CustomWidgetId) => {
      const grid = gridInstance.current;
      if (grid) {
        const current = grid.save(false) as GridStackWidget[];
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(current.filter((w) => w.id !== id)),
        );
      }
      const newIds = customWidgetIds.filter((wid) => wid !== id);
      localStorage.setItem(CUSTOM_WIDGETS_KEY, JSON.stringify(newIds));
      setCustomWidgetIds(newIds);
    },
    [customWidgetIds],
  );

  const customIdSet = useMemo(
    () => new Set(customWidgetIds),
    [customWidgetIds],
  );

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

        <AddWidgetDialog
          activeWidgetIds={customWidgetIds}
          onAdd={handleAddWidget}
        />
      </div>

      <div ref={gridRef} className="grid-stack">
        {fullLayout.map((item) => (
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
                  {customIdSet.has(item.id as CustomWidgetId) && (
                    <button
                      className="ml-auto mr-1.5 rounded p-0.5 hover:bg-destructive/20 hover:text-destructive transition-colors cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveWidget(item.id as CustomWidgetId);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              )}

              <div className="flex-1 min-h-0 overflow-auto p-0">
                {item.id === "stat-leads" && (
                  <StatCardWidget
                    title="Total Leads"
                    icon={TrendingUp}
                    stat={stats?.totalLeads}
                    isLoading={isLoading}
                  />
                )}

                {item.id === "stat-deals" && (
                  <StatCardWidget
                    title="Total Deals"
                    icon={Handshake}
                    stat={stats?.totalDeals}
                    isLoading={isLoading}
                  />
                )}

                {item.id === "stat-organizations" && (
                  <StatCardWidget
                    title="Organizations"
                    icon={Building2}
                    stat={stats?.totalOrganizations}
                    isLoading={isLoading}
                  />
                )}

                {item.id === "stat-users" && (
                  <StatCardWidget
                    title="Total Users"
                    icon={Users}
                    stat={stats?.totalUsers}
                    isLoading={isLoading}
                  />
                )}

                {item.id === "recent-leads" && (
                  <RecentLeadsWidget
                    recentLeads={recentLeads}
                    isLoading={isLoading}
                  />
                )}

                {item.id === "recent-deals" && (
                  <RecentDealsWidget
                    recentDeals={recentDeals}
                    isLoading={isLoading}
                  />
                )}

                {item.id === "chart-lead-status" && <LeadStatusWidget />}

                {item.id === "chart-monthly-revenue" && (
                  <MonthlyRevenueWidget />
                )}

                {item.id === "chart-lead-sources" && <LeadSourcesWidget />}

                {item.id === "chart-deal-pipeline" && <DealPipelineWidget />}

                {item.id === "chart-call-activity" && <CallActivityWidget />}

                {item.id === "chart-lead-score" && <LeadScoreWidget />}

                {item.id === "chart-org-industry" && <OrgIndustryWidget />}

                {item.id === "chart-deal-win-rate" && <DealWinRateWidget />}

                {item.id === "chart-conversion-funnel" && (
                  <ConversionFunnelWidget />
                )}

                {item.id === "chart-revenue-target" && <RevenueTargetWidget />}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
