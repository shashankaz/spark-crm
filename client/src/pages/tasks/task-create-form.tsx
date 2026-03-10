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

import { useCreateTask } from "@/hooks";

interface TaskCreateFormProps {
  setOpen: (open: boolean) => void;
}

export const TaskCreateForm = ({ setOpen }: TaskCreateFormProps) => {
  const [labels, setLabels] = useState<string[]>([]);

  const { mutate, isPending } = useCreateTask();

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    mode: "onChange",
    defaultValues: {
      title: undefined,
      description: undefined,
      priority: "medium",
    },
  });

  const addLabel = () => {
    const val = form.getValues("labelInput")?.trim();
    if (val && !labels.includes(val)) {
      setLabels([...labels, val]);
    }
    form.setValue("labelInput", "");
  };

  const removeLabel = (label: string) => {
    setLabels(labels.filter((l) => l !== label));
  };

  const onSubmit = (values: TaskFormValues) => {
    mutate(
      {
        title: values.title,
        description: values.description,
        priority: values.priority,
        dueDate: values.dueDate?.toISOString(),
        reminderAt: values.reminderAt?.toISOString(),
        labels,
      },
      {
        onSuccess: ({ message }) => {
          toast.success(message);
          form.reset();
          setOpen(false);
        },
        onError: ({ message }) => {
          toast.error(message);
        },
      },
    );
  };

  return (
    <form id="task-create-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="gap-5">
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="-space-y-2">
              <FieldLabel htmlFor="title">
                Title <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                {...field}
                id="title"
                aria-invalid={fieldState.invalid}
                placeholder="Enter task title"
                autoComplete="off"
              />
              {fieldState.invalid && (
                <FieldError
                  className="text-destructive text-xs"
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
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea
                {...field}
                id="description"
                aria-invalid={fieldState.invalid}
                placeholder="Add a description..."
                className="resize-none"
                rows={3}
              />
              {fieldState.invalid && (
                <FieldError
                  className="text-destructive text-xs"
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
              <FieldLabel htmlFor="priority">Priority</FieldLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <SelectTrigger
                  className="w-full"
                  id="priority"
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
                  className="text-destructive text-xs"
                  errors={[fieldState.error]}
                />
              )}
            </Field>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="dueDate"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="-space-y-2">
                <FieldLabel htmlFor="dueDate">Due Date</FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="dueDate"
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
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                    />
                  </PopoverContent>
                </Popover>
                {fieldState.invalid && (
                  <FieldError
                    className="text-destructive text-xs"
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
                <FieldLabel htmlFor="reminderAt">
                  <span className="flex items-center gap-1">
                    <Bell className="h-3.5 w-3.5" /> Reminder
                  </span>
                </FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="reminderAt"
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
                      selected={field.value}
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
                    className="text-destructive text-xs"
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
              <FieldLabel htmlFor="labelInput">Labels</FieldLabel>
              <div className="flex gap-2">
                <Input
                  {...field}
                  id="labelInput"
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
                      className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
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
          onClick={() => {
            form.reset();
            setLabels([]);
          }}
          disabled={isPending}
        >
          Reset
        </Button>
        <Button type="submit" form="task-create-form" disabled={isPending}>
          {isPending ? "Creating..." : "Create Task"}
        </Button>
      </div>
    </form>
  );
};
