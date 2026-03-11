import { useEffect, useRef, useState } from "react";
import { Bell, BellOff, CheckCheck, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { NotificationItem } from "./notification-item";

import { cn } from "@/lib/utils";

import type { Notification } from "@/types/domain";

// Mock data and functions for demonstration
const notifications: Notification[] = [];
const unreadCount = 0;
const connected = false;
const markRead = () => {};
const deleteNotification = () => {};
const markAllRead = () => {};
const deleteAllNotifications = () => {};

export const NotificationPanel = () => {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handler);
    }

    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative" ref={panelRef}>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setOpen((v) => !v)}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px] flex items-center justify-center bg-destructive text-destructive-foreground border-0">
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
        <span
          className={cn(
            "absolute bottom-0 right-0 w-2 h-2 rounded-full border border-background",
            connected ? "bg-emerald-500" : "bg-slate-400",
          )}
        />
      </Button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-xl border bg-background shadow-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="flex items-center gap-2">
              <Bell size={16} />
              <span className="font-semibold text-sm">Notifications</span>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-xs h-5 px-1.5">
                  {unreadCount} new
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  title="Mark all as read"
                  onClick={markAllRead}
                >
                  <CheckCheck size={14} />
                </Button>
              )}
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  title="Clear all"
                  onClick={deleteAllNotifications}
                >
                  <Trash2 size={14} />
                </Button>
              )}
            </div>
          </div>

          <ScrollArea className="h-105">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-105 gap-2 text-muted-foreground">
                <BellOff size={24} />
                <span className="text-sm">No notifications yet</span>
              </div>
            ) : (
              notifications.map((n, idx) => (
                <div key={n._id}>
                  <NotificationItem
                    notification={n}
                    onRead={markRead}
                    onDelete={deleteNotification}
                  />
                  {idx < notifications.length - 1 && (
                    <Separator className="mx-4" />
                  )}
                </div>
              ))
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
};
