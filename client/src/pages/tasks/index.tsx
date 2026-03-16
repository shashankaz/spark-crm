import { useState, useMemo } from "react";
import debounce from "lodash/debounce";
import { Helmet } from "react-helmet-async";
import {
  Plus,
  ListTodo,
  CheckCircle2,
  Loader2,
  Circle,
} from "lucide-react";
import { useHotkey } from "@tanstack/react-hotkeys";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Heading } from "@/components/shared/typography/heading";
import { Description } from "@/components/shared/typography/description";

import { TaskCard } from "./task-card";
import { TaskCreateForm } from "./task-create-form";

import { useTasks } from "@/hooks";

import type { Task } from "@/types/domain";

const TABS = [
  { value: "all", label: "All", icon: ListTodo },
  { value: "todo", label: "To Do", icon: Circle },
  { value: "in_progress", label: "In Progress", icon: Loader2 },
  { value: "completed", label: "Completed", icon: CheckCircle2 },
];

const TaskPage = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [priority, setPriority] = useState<string>("all");

  const handleSearchChange = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearch(value);
      }, 400),
    [],
  );

  const { data, isPending } = useTasks({
    search: debouncedSearch || undefined,
    status: activeTab !== "all" ? activeTab : undefined,
    priority: priority !== "all" ? priority : undefined,
  });

  const tasks: Task[] = data?.tasks ?? [];
  const counts = data?.counts ?? {
    all: 0,
    todo: 0,
    in_progress: 0,
    completed: 0,
  };

  useHotkey("Mod+T", () => setOpen(true));

  return (
    <>
      <Helmet>
        <title>Tasks | Dashboard</title>
        <meta name="description" content="Manage your tasks and reminders" />
      </Helmet>

      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <Heading title="Tasks" />
            <Description description="Manage your to-dos, reminders and track progress" />
          </div>
          <Button type="button" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            New Task
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Input
            placeholder="Search tasks..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              handleSearchChange(e.target.value);
            }}
            className="max-w-xs"
          />
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="h-9">
            {TABS.map(({ value, label, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="gap-1.5 text-xs"
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
                <span className="ml-1 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium leading-none">
                  {counts[value as keyof typeof counts] ?? 0}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {TABS.map(({ value }) => (
            <TabsContent key={value} value={value} className="mt-4">
              {isPending ? (
                <div className="flex items-center justify-center py-16 text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  Loading tasks...
                </div>
              ) : tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
                  <ListTodo className="h-10 w-10 opacity-30" />
                  <p className="text-sm">No tasks found</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Create your first task
                  </Button>
                </div>
              ) : (
                <div className="grid gap-2">
                  {tasks.map((task) => (
                    <TaskCard key={task._id} task={task} />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl">Create New Task</DialogTitle>
          </DialogHeader>
          <TaskCreateForm setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskPage;
