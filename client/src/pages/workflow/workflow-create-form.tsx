import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import {
  workflowFormSchema,
  type WorkflowFormValues,
} from "./workflow-form-schema";
import { availableActions, entityEvents } from "./helpers";

interface WorkflowCreateFormProps {
  onCreate: (data: Omit<WorkflowFormValues, "id"> & { name: string }) => void;
  isLoading?: boolean;
}

type ActionConfig = Record<string, string | undefined>;

export const WorkflowCreateForm: React.FC<WorkflowCreateFormProps> = ({
  onCreate,
  isLoading = false,
}) => {
  const form = useForm<WorkflowFormValues>({
    resolver: zodResolver(workflowFormSchema),
    mode: "onChange",
    defaultValues: {
      name: undefined,
      description: undefined,
      active: true,
      entity: undefined,
      event: undefined,
      actions: undefined,
      actionConfigs: {},
    },
  });

  const watchedEntity = form.watch("entity");
  const watchedEvent = form.watch("event");
  const watchedActions = form.watch("actions") ?? [];
  const watchedActionConfigs = form.watch("actionConfigs") ?? {};

  const setActionConfig = (actionId: string, config: ActionConfig) => {
    const current = form.getValues("actionConfigs") ?? {};
    form.setValue("actionConfigs", {
      ...current,
      [actionId]: { ...(current[actionId] ?? {}), ...config },
    });
  };

  const submit = (data: WorkflowFormValues) => {
    if (data.actions?.length === 0) {
      toast.error("Please select at least one action");
      return;
    }

    try {
      onCreate({
        name: data.name,
        description: data.description,
        active: !!data.active,
        entity: data.entity,
        event: data.event,
        actions: data.actions,
        actionConfigs: data.actionConfigs ?? {},
      });
      form.reset();
    } catch {
      toast.error("Failed to create workflow");
    }
  };

  return (
    <form id="workflow-create-form" onSubmit={form.handleSubmit(submit)}>
      <FieldGroup className="grid grid-cols-2 md:grid-cols-3 gap-8 -space-y-4">
        <div className="col-span-3 space-y-3">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="-space-y-2">
                <FieldLabel htmlFor="name">
                  Name <span className="text-error">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  id="name"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter workflow name"
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
              <Field
                data-invalid={fieldState.invalid}
                className="-space-y-2 col-span-2 md:col-span-2"
              >
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  {...field}
                  id="description"
                  placeholder="Optional description"
                  className="min-h-20 resize-none"
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
            name="active"
            control={form.control}
            render={({ field }) => (
              <Field className="-space-y-2">
                <FieldLabel htmlFor="active">Active</FieldLabel>
                <div className="flex items-center gap-2 h-9">
                  <Switch
                    id="active"
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                  <span className="text-sm text-muted-foreground">
                    {field.value ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </Field>
            )}
          />
        </div>

        <div className="col-span-2 md:col-span-3">
          <Separator />
          <p className="text-sm font-semibold mt-3 mb-1">Trigger</p>
        </div>

        <div className="col-span-3 grid grid-cols-2 gap-4 mb-0.5">
          <Controller
            name="entity"
            control={form.control}
            render={({ field }) => (
              <Field className="-space-y-2">
                <FieldLabel htmlFor="entity">
                  Apply To <span className="text-error">*</span>
                </FieldLabel>
                <Select
                  onValueChange={(val) => {
                    field.onChange(val);
                    form.setValue("event", val);
                  }}
                  value={field.value ?? ""}
                >
                  <SelectTrigger id="entity" className="w-full">
                    <SelectValue placeholder="Select entity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="lead">Lead</SelectItem>
                      <SelectItem value="deal">Deal</SelectItem>
                      <SelectItem value="organization">Organization</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            )}
          />

          <Controller
            name="event"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="-space-y-2">
                <FieldLabel htmlFor="event">
                  Event <span className="text-error">*</span>
                </FieldLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                  disabled={!watchedEntity}
                >
                  <SelectTrigger id="event" className="w-full">
                    <SelectValue placeholder="Select event" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {(entityEvents[watchedEntity ?? ""] ?? []).map((e) => (
                        <SelectItem key={e.id} value={e.id}>
                          {e.label}
                        </SelectItem>
                      ))}
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

        <div className="col-span-2 md:col-span-3">
          <Separator />
          <p className="text-sm font-semibold mt-3 mb-1">Actions</p>
          <p className="text-xs text-muted-foreground mb-3">
            Only one action is allowed per workflow in this version. Select an
            entity and event above to see available actions.
          </p>
        </div>

        <Controller
          name="actions"
          control={form.control}
          render={({ field }) => (
            <div className="col-span-2 md:col-span-3 space-y-4">
              {availableActions.map((a) => {
                const isChecked =
                  (field.value as string[] | undefined)?.includes(a.id) ??
                  false;
                return (
                  <div
                    key={a.id}
                    className={`space-y-3 rounded-lg border p-4 transition-colors ${isChecked ? "border-primary/40 bg-primary/5" : ""}`}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id={`action-${a.id}`}
                        checked={isChecked}
                        disabled={!watchedEntity || !watchedEvent}
                        onCheckedChange={(checked) => {
                          const next = new Set(
                            (field.value as string[] | undefined) ?? [],
                          );
                          if (checked) next.add(a.id);
                          else next.delete(a.id);
                          field.onChange(Array.from(next));
                        }}
                        className="mt-0.5"
                      />
                      <div>
                        <Label
                          htmlFor={`action-${a.id}`}
                          className="font-medium cursor-pointer"
                        >
                          {a.label}
                        </Label>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {a.description}
                        </p>
                      </div>
                    </div>

                    {isChecked && (
                      <div className="ml-7 space-y-3">
                        {a.id === "send_email" && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Field className="-space-y-2">
                              <FieldLabel htmlFor={`${a.id}-to`}>To</FieldLabel>
                              <Input
                                id={`${a.id}-to`}
                                placeholder="Comma-separated emails"
                                value={
                                  (
                                    watchedActionConfigs?.[a.id] as
                                      | ActionConfig
                                      | undefined
                                  )?.to ?? ""
                                }
                                onChange={(e) =>
                                  setActionConfig(a.id, { to: e.target.value })
                                }
                              />
                            </Field>
                            <Field className="-space-y-2">
                              <FieldLabel htmlFor={`${a.id}-subject`}>
                                Subject
                              </FieldLabel>
                              <Input
                                id={`${a.id}-subject`}
                                placeholder="Email subject"
                                value={
                                  (
                                    watchedActionConfigs?.[a.id] as
                                      | ActionConfig
                                      | undefined
                                  )?.subject ?? ""
                                }
                                onChange={(e) =>
                                  setActionConfig(a.id, {
                                    subject: e.target.value,
                                  })
                                }
                              />
                            </Field>
                            <Field className="-space-y-2 sm:col-span-2">
                              <FieldLabel htmlFor={`${a.id}-message`}>
                                Message
                              </FieldLabel>
                              <Textarea
                                id={`${a.id}-message`}
                                placeholder="Email body"
                                value={
                                  (
                                    watchedActionConfigs?.[a.id] as
                                      | ActionConfig
                                      | undefined
                                  )?.message ?? ""
                                }
                                onChange={(e) =>
                                  setActionConfig(a.id, {
                                    message: e.target.value,
                                  })
                                }
                                className="min-h-32 resize-none"
                              />
                            </Field>
                          </div>
                        )}

                        {a.id === "notify_user" && (
                          <Field className="-space-y-2">
                            <FieldLabel htmlFor={`${a.id}-message`}>
                              Message
                            </FieldLabel>
                            <Input
                              id={`${a.id}-message`}
                              placeholder="Notification message"
                              value={
                                (
                                  watchedActionConfigs?.[a.id] as
                                    | ActionConfig
                                    | undefined
                                )?.message ?? ""
                              }
                              onChange={(e) =>
                                setActionConfig(a.id, {
                                  message: e.target.value,
                                })
                              }
                            />
                          </Field>
                        )}

                        {a.id === "send_webhook" && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Field className="-space-y-2 sm:col-span-2">
                              <FieldLabel htmlFor={`${a.id}-url`}>
                                Webhook URL
                              </FieldLabel>
                              <Input
                                id={`${a.id}-url`}
                                placeholder="https://example.com/webhook"
                                value={
                                  (
                                    watchedActionConfigs?.[a.id] as
                                      | ActionConfig
                                      | undefined
                                  )?.url ?? ""
                                }
                                onChange={(e) =>
                                  setActionConfig(a.id, { url: e.target.value })
                                }
                              />
                            </Field>
                            <Field className="-space-y-2 col-span-2 mb-2">
                              <FieldLabel htmlFor={`${a.id}-method`}>
                                HTTP Method
                              </FieldLabel>
                              <Select
                                onValueChange={(val) =>
                                  setActionConfig(a.id, { method: val })
                                }
                                value={
                                  (
                                    watchedActionConfigs?.[a.id] as
                                      | ActionConfig
                                      | undefined
                                  )?.method ?? "POST"
                                }
                              >
                                <SelectTrigger
                                  id={`${a.id}-method`}
                                  className="w-full"
                                >
                                  <SelectValue placeholder="Method" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectItem value="POST">POST</SelectItem>
                                    <SelectItem value="GET">GET</SelectItem>
                                    <SelectItem value="PUT">PUT</SelectItem>
                                    <SelectItem value="PATCH">PATCH</SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </Field>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {watchedActions.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Select an entity and event above, then check one or more
                  actions.
                </p>
              )}
            </div>
          )}
        />
      </FieldGroup>

      <div className="space-x-2 mt-8 flex justify-end">
        <Button type="button" variant="outline" onClick={() => form.reset()}>
          Reset
        </Button>
        <Button
          type="submit"
          form="workflow-create-form"
          disabled={!form.formState.isValid || isLoading}
        >
          {isLoading ? "Creating…" : "Create Workflow"}
        </Button>
      </div>
    </form>
  );
};

export default WorkflowCreateForm;
