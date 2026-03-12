import { useNavigate } from "react-router";
import { formatDistanceToNow } from "date-fns";
import { Check, X } from "lucide-react";

import { cn } from "@/lib/utils";

import type { INotification } from "@/types/domain";

const categoryColor: Record<string, string> = {
  lead: "bg-blue-500",
  deal: "bg-emerald-500",
  task: "bg-violet-500",
  call: "bg-orange-500",
  email: "bg-sky-500",
  comment: "bg-pink-500",
  workflow: "bg-amber-500",
  system: "bg-slate-500",
  user: "bg-indigo-500",
};

const typeIcon: Record<string, string> = {
  info: "🔔",
  success: "✅",
  warning: "⚠️",
  error: "❌",
};

interface NotificationItemProps {
  notification: INotification;
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export const NotificationItem = ({
  notification,
  onRead,
  onDelete,
}: NotificationItemProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!notification.isRead) onRead(notification._id);
    if (notification.link) navigate(notification.link);
  };

  return (
    <div
      className={cn(
        "group relative flex items-start gap-3 px-4 py-3 transition-colors cursor-pointer",
        !notification.isRead
          ? "bg-primary/5 hover:bg-primary/10"
          : "hover:bg-muted/50",
      )}
      onClick={handleClick}
    >
      {!notification.isRead && (
        <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
      )}

      <span
        className={cn(
          "mt-1 w-2 h-2 rounded-full shrink-0",
          categoryColor[notification.category] ?? "bg-slate-400",
        )}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs">{typeIcon[notification.type]}</span>
          <p
            className={cn(
              "text-sm truncate",
              !notification.isRead ? "font-medium" : "text-muted-foreground",
            )}
          >
            {notification.title}
          </p>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
          {notification.message}
        </p>
        <p className="text-[10px] text-muted-foreground/70 mt-1">
          {formatDistanceToNow(notification.createdAt, {
            addSuffix: true,
          })}
        </p>
      </div>

      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        {!notification.isRead && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRead(notification._id);
            }}
            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
            title="Mark as read"
          >
            <Check size={12} />
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(notification._id);
          }}
          className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-destructive"
          title="Delete"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  );
};
