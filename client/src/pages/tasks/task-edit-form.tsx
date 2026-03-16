import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Bell } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";

import { taskFormSchema } from "./task-form-schema";
import type { TaskFormValues } from "./task-form-schema";

import { cn } from "@/lib/utils";

import { useUpdateTask } from "@/hooks";

import type { Task } from "@/types/domain";

interface TaskEditFormProps {
  task: Task;
  setOpen: (open: boolean) => void;
}

export const TaskEditForm = ({ task, setOpen }: TaskEditFormProps) => {
  const [labels, setLabels] = useState<string[]>(task.labels ?? []);
  const { mutate, isPending } = useUpdateTask();

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    mode: "onChange",
    defaultValues: {
      title: task.title,
      description: task.description ?? "",
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      reminderAt: task.reminderAt ? new Date(task.reminderAt) : undefined,
    },
  });

  const addLabel = () => {
    const val = form.getValues("labelInput")?.trim();
    if (val && !labels.includes(val)) setLabels([...labels, val]);
    form.setValue("labelInput", "");
  };

  const removeLabel = (label: string) =>
    setLabels(labels.filter((l) => l !== label));

  const onSubmit = (values: TaskFormValues) => {
    mutate(
      {
        id: task._id,
        title: values.title,
        description: values.description,
        status: values.status,
        priority: values.priority,
        dueDate: values.dueDate?.toISOString(),
        reminderAt: values.reminderAt?.toISOString(),
        labels,
      },
      {
        onSuccess: ({ message }) => {
          toast.success(message);
          setOpen(false);
        },
        onError: ({ message }) => {
          toast.error(message);
        },
      },
    );
  };

  return (
    <form id="task-edit-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="gap-5">
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel htmlFor="edit-title">
                Title <span className="text-error">*</span>
              </FieldLabel>
              <Input
                {...field}
                id="edit-title"
                aria-invalid={fieldState.invalid}
                placeholder="Enter task title"
                autoComplete="off"
              />
              {fieldState.invalid && (
                <FieldError
                  className="text-error text-xs"
                  errors={[fieldState.error]}
                />
              )}
            </Field>
          )}
        />

        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel htmlFor="edit-description">Description</FieldLabel>
              <Textarea
                {...field}
                id="edit-description"
                aria-invalid={fieldState.invalid}
                placeholder="Add a description..."
                className="resize-none"
                rows={3}
              />
              {fieldState.invalid && (
                <FieldError
                  className="text-error text-xs"
                  errors={[fieldState.error]}
                />
              )}
            </Field>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="status"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="-space-y-2">
                <FieldLabel htmlFor="edit-status">Status</FieldLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                >
                  <SelectTrigger
                    className="w-full"
                    id="edit-status"
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError
                    className="text-error text-xs"
                    errors={[fieldState.error]}
                  />
                )}
              </Field>
            )}
          />

          <Controller
            name="priority"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="-space-y-2">
                <FieldLabel htmlFor="edit-priority">Priority</FieldLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                >
                  <SelectTrigger
                    className="w-full"
                    id="edit-priority"
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError
                    className="text-error text-xs"
                    errors={[fieldState.error]}
                  />
                )}
              </Field>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="dueDate"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="-space-y-2">
                <FieldLabel htmlFor="edit-dueDate">Due Date</FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="edit-dueDate"
                      variant="outline"
                      aria-invalid={fieldState.invalid}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ?? undefined}
                      onSelect={field.onChange}
                    />
                  </PopoverContent>
                </Popover>
                {fieldState.invalid && (
                  <FieldError
                    className="text-error text-xs"
                    errors={[fieldState.error]}
                  />
                )}
              </Field>
            )}
          />

          <Controller
            name="reminderAt"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="-space-y-2">
                <FieldLabel htmlFor="edit-reminderAt">
                  <span className="flex items-center gap-1">
                    <Bell className="h-3.5 w-3.5" /> Reminder
                  </span>
                </FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="edit-reminderAt"
                      variant="outline"
                      aria-invalid={fieldState.invalid}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP p")
                      ) : (
                        <span>Set reminder</span>
                      )}
                      <Bell className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ?? undefined}
                      onSelect={(date) => {
                        if (date) {
                          const now = new Date();
                          date.setHours(
                            now.getHours(),
                            now.getMinutes() + 5,
                            0,
                            0,
                          );
                        }
                        field.onChange(date);
                      }}
                    />
                    {field.value && (
                      <div className="p-3 border-t">
                        <p className="text-xs text-muted-foreground mb-1">
                          Time
                        </p>
                        <Input
                          type="time"
                          value={format(field.value, "HH:mm")}
                          onChange={(e) => {
                            const [h, m] = e.target.value
                              .split(":")
                              .map(Number);
                            const updated = new Date(field.value!);
                            updated.setHours(h, m);
                            field.onChange(updated);
                          }}
                          className="h-8 text-sm"
                        />
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
                {fieldState.invalid && (
                  <FieldError
                    className="text-error text-xs"
                    errors={[fieldState.error]}
                  />
                )}
              </Field>
            )}
          />
        </div>

        <Controller
          name="labelInput"
          control={form.control}
          render={({ field }) => (
            <Field className="-space-y-2">
              <FieldLabel htmlFor="edit-labelInput">Labels</FieldLabel>
              <div className="flex gap-2">
                <Input
                  {...field}
                  id="edit-labelInput"
                  placeholder="Type a label and press Add or Enter..."
                  autoComplete="off"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addLabel();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addLabel}>
                  Add
                </Button>
              </div>
              {labels.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {labels.map((label) => (
                    <Badge
                      key={label}
                      variant="secondary"
                      className="cursor-pointer hover:bg-error hover:text-error/50 transition-colors"
                      onClick={() => removeLabel(label)}
                    >
                      {label} ×
                    </Badge>
                  ))}
                </div>
              )}
            </Field>
          )}
        />
      </FieldGroup>

      <div className="flex justify-end gap-2 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpen(false)}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" form="task-edit-form" disabled={isPending}>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};
