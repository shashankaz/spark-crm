import { useState } from "react";
import { Plus, Check } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  CUSTOM_WIDGETS,
  type CustomWidgetId,
  type WidgetMeta,
} from "./widget-registry";

const CATEGORIES = ["All", "Leads", "Deals", "Organizations", "Calls"] as const;
type Category = (typeof CATEGORIES)[number];

const CATEGORY_COLORS: Record<string, string> = {
  Leads: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Deals: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Organizations:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Calls:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

type AddWidgetDialogProps = {
  activeWidgetIds: CustomWidgetId[];
  onAdd: (widget: WidgetMeta) => void;
};

export const AddWidgetDialog = ({
  activeWidgetIds,
  onAdd,
}: AddWidgetDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");

  const filtered = CUSTOM_WIDGETS.filter(
    (w) => selectedCategory === "All" || w.category === selectedCategory,
  );

  const handleAdd = (widget: WidgetMeta) => {
    onAdd(widget);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Add Widget
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Widget</DialogTitle>
          <DialogDescription>
            Choose a chart widget to add to your dashboard
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
          {filtered.map((widget) => {
            const isActive = activeWidgetIds.includes(widget.id);
            const Icon = widget.icon;

            return (
              <button
                key={widget.id}
                disabled={isActive}
                onClick={() => !isActive && handleAdd(widget)}
                className={`text-left p-4 rounded-xl border transition-all group ${
                  isActive
                    ? "border-primary/40 bg-primary/5 opacity-60 cursor-not-allowed"
                    : "border-border hover:border-primary/50 hover:bg-accent cursor-pointer"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="rounded-md bg-muted p-2 group-hover:bg-background transition-colors">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  {isActive ? (
                    <span className="flex items-center gap-1 text-xs text-primary font-medium">
                      <Check className="h-3.5 w-3.5" />
                      Added
                    </span>
                  ) : (
                    <Plus className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
                <p className="text-sm font-semibold leading-tight mb-1">
                  {widget.title}
                </p>
                <p className="text-xs text-muted-foreground leading-snug mb-2">
                  {widget.description}
                </p>
                <Badge
                  variant="outline"
                  className={`text-[10px] px-2 py-0.5 ${CATEGORY_COLORS[widget.category]}`}
                >
                  {widget.category}
                </Badge>
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
