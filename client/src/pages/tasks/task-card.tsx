import { useState } from "react";
import { format, isPast, isToday } from "date-fns";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Bell,
  BellOff,
  CalendarDays,
  CheckCircle2,
  Circle,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

import { TaskEditForm } from "./task-edit-form";
import type { Task, TaskStatus } from "@/types/domain";

import { cn } from "@/lib/utils";

import { useUpdateTask, useDeleteTask } from "@/hooks";

const STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; icon: React.ElementType; color: string }
> = {
  todo: { label: "To Do", icon: Circle, color: "text-muted-foreground" },
  in_progress: { label: "In Progress", icon: Loader2, color: "text-blue-500" },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    color: "text-green-500",
  },
};

const PRIORITY_CONFIG = {
  low: {
    label: "Low",
    className:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
  medium: {
    label: "Medium",
    className:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  },
  high: {
    label: "High",
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
};

interface TaskCardProps {
  task: Task;
}

export const TaskCard = ({ task }: TaskCardProps) => {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { mutateAsync: updateTask } = useUpdateTask();
  const { mutateAsync: deleteTask, isPending: isDeleting } = useDeleteTask();

  const statusCfg = STATUS_CONFIG[task.status];
  const StatusIcon = statusCfg.icon;
  const priorityCfg = PRIORITY_CONFIG[task.priority];

  const isDone = task.status === "completed";

  const dueDateObj = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = dueDateObj && isPast(dueDateObj) && !isDone;
  const isDueToday = dueDateObj && isToday(dueDateObj) && !isDone;

  const cycleStatus = async () => {
    const next: Record<TaskStatus, TaskStatus> = {
      todo: "in_progress",
      in_progress: "completed",
      completed: "todo",
    };

    updateTask(
      { id: task._id, status: next[task.status] },
      {
        onSuccess: ({ message }) => {
          toast.success(message);
        },
        onError: ({ message }) => {
          toast.error(message);
        },
      },
    );
  };

  const handleDelete = async () => {
    deleteTask(
      { id: task._id },
      {
        onSuccess: ({ message }) => {
          toast.success(message);
          setDeleteOpen(false);
        },
        onError: ({ message }) => {
          toast.error(message);
        },
      },
    );
  };

  return (
    <>
      <div
        className={cn(
          "group relative flex items-start gap-3 rounded-xl border p-4 transition-all hover:shadow-sm",
          isDone && "opacity-60",
        )}
      >
        <button
          type="button"
          onClick={cycleStatus}
          className={cn("mt-0.5 shrink-0 transition-colors", statusCfg.color)}
          title={`Status: ${statusCfg.label} — click to advance`}
        >
          <StatusIcon
            className={cn(
              "h-5 w-5",
              task.status === "in_progress" && "animate-spin",
            )}
          />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p
              className={cn(
                "font-medium text-sm leading-snug",
                isDone && "line-through text-muted-foreground",
              )}
            >
              {task.title}
            </p>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 shrink-0"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditOpen(true)}>
                  <Pencil className="h-4 w-4 mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setDeleteOpen(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {task.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge
              variant="outline"
              className={cn(
                "text-xs px-1.5 py-0 border-0",
                priorityCfg.className,
              )}
            >
              {priorityCfg.label}
            </Badge>

            {dueDateObj && (
              <span
                className={cn(
                  "flex items-center gap-1 text-xs",
                  isOverdue
                    ? "text-destructive"
                    : isDueToday
                      ? "text-amber-500"
                      : "text-muted-foreground",
                )}
              >
                <CalendarDays className="h-3 w-3" />
                {isOverdue ? "Overdue · " : isDueToday ? "Today · " : ""}
                {format(dueDateObj, "MMM d")}
              </span>
            )}

            {task.reminderAt && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                {task.reminderSent ? (
                  <BellOff className="h-3 w-3 text-muted-foreground/50" />
                ) : (
                  <Bell className="h-3 w-3 text-amber-500" />
                )}
                {format(new Date(task.reminderAt), "MMM d, p")}
              </span>
            )}

            {task.labels.map((label) => (
              <Badge
                key={label}
                variant="secondary"
                className="text-xs px-1.5 py-0"
              >
                {label}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Task</DialogTitle>
          </DialogHeader>
          <TaskEditForm task={task} setOpen={setEditOpen} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete task?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{task.title}". This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
