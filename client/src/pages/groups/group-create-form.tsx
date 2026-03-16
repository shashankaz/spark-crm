import { useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, Check, User, AtSign, Building2, X } from "lucide-react";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { groupFormSchema } from "./group-form-schema";
import type { GroupFormValues } from "./group-form-schema";

import { useCreateGroup, useLeads } from "@/hooks";

import type { ILead } from "@/types/domain";

interface GroupCreateFormProps {
  setOpen: (open: boolean) => void;
}

export const GroupCreateForm: React.FC<GroupCreateFormProps> = ({
  setOpen,
}) => {
  const [selectedLeads, setSelectedLeads] = useState<ILead[]>([]);
  const [search, setSearch] = useState("");

  const { data, isPending } = useLeads({});
  const leads = useMemo(() => data?.leads ?? [], [data?.leads]);

  const { mutate, isPending: isCreating } = useCreateGroup();

  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupFormSchema),
    mode: "onChange",
    defaultValues: { name: "", description: "" },
  });

  // Move this to server
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return leads;
    return leads.filter(
      (l) =>
        l.firstName?.toLowerCase().includes(q) ||
        l.lastName?.toLowerCase().includes(q) ||
        l.email?.toLowerCase().includes(q) ||
        l.orgName?.toLowerCase().includes(q),
    );
  }, [leads, search]);

  const isSelected = (lead: ILead) =>
    selectedLeads.some((l) => l._id === lead._id);

  const toggleLead = (lead: ILead) => {
    setSelectedLeads((prev) =>
      isSelected(lead)
        ? prev.filter((l) => l._id !== lead._id)
        : [...prev, lead],
    );
  };

  const toggleAll = () => {
    if (filtered.every((l) => isSelected(l))) {
      setSelectedLeads((prev) =>
        prev.filter((l) => !filtered.some((f) => f._id === l._id)),
      );
    } else {
      setSelectedLeads((prev) => {
        const ids = new Set(prev.map((l) => l._id));
        return [...prev, ...filtered.filter((l) => !ids.has(l._id))];
      });
    }
  };

  const allFilteredSelected =
    filtered.length > 0 && filtered.every((l) => isSelected(l));
  const someFilteredSelected =
    filtered.some((l) => isSelected(l)) && !allFilteredSelected;

  const onSubmit = (values: GroupFormValues) => {
    mutate(
      { ...values, leads: selectedLeads.map((l) => l._id) },
      {
        onSuccess: ({ message }) => {
          toast.success(message);
          form.reset();
          setSelectedLeads([]);
          setOpen(false);
        },
        onError: ({ message }) => {
          toast.error(message);
        },
      },
    );
  };

  return (
    <form
      id="group-create-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="space-y-1.5">
              <FieldLabel htmlFor="name">
                Name <span className="text-error">*</span>
              </FieldLabel>
              <Input {...field} id="name" placeholder="e.g. Q3 Prospects" />
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
            <Field data-invalid={fieldState.invalid} className="space-y-1.5">
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Input
                {...field}
                id="description"
                placeholder="Optional description"
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
      </FieldGroup>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Select Leads</label>
          {selectedLeads.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {selectedLeads.length} selected
              </span>
              <button
                type="button"
                onClick={() => setSelectedLeads([])}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-0.5 transition-colors"
              >
                <X className="h-3 w-3" /> Clear
              </button>
            </div>
          )}
        </div>

        <div className="border rounded-xl overflow-hidden bg-card">
          <div className="px-3 py-2 border-b bg-muted/30">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email or organization…"
                className="bg-background pl-8 pr-3 py-1.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-[2rem_1fr_1fr_1fr] gap-x-3 px-3 py-2 border-b bg-muted/40">
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={toggleAll}
                className={`h-4 w-4 rounded border-2 flex items-center justify-center transition-colors ${
                  allFilteredSelected
                    ? "bg-primary border-primary"
                    : someFilteredSelected
                      ? "bg-primary/40 border-primary"
                      : "border-muted-foreground/40 hover:border-primary"
                }`}
              >
                {(allFilteredSelected || someFilteredSelected) && (
                  <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                )}
              </button>
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <User className="h-3 w-3" /> Name
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <AtSign className="h-3 w-3" /> Email
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Building2 className="h-3 w-3" /> Org
            </span>
          </div>

          <div className="overflow-y-auto max-h-56">
            {isPending ? (
              <div className="flex flex-col gap-2 p-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-9 rounded-lg bg-muted/40 animate-pulse"
                  />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center gap-1.5">
                <Search className="h-6 w-6 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  {leads.length === 0
                    ? "No leads available."
                    : "No leads match your search."}
                </p>
              </div>
            ) : (
              filtered.map((lead, idx) => {
                const selected = isSelected(lead);
                return (
                  <button
                    key={lead._id}
                    type="button"
                    onClick={() => toggleLead(lead)}
                    className={`w-full grid grid-cols-[2rem_1fr_1fr_1fr] gap-x-3 px-3 py-2.5 text-left items-center transition-colors ${
                      idx !== filtered.length - 1
                        ? "border-b border-border/40"
                        : ""
                    } ${
                      selected
                        ? "bg-primary/5 hover:bg-primary/10"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      <span
                        className={`h-4 w-4 rounded border-2 flex items-center justify-center transition-colors shrink-0 ${
                          selected
                            ? "bg-primary border-primary"
                            : "border-muted-foreground/40"
                        }`}
                      >
                        {selected && (
                          <Check
                            className="h-2.5 w-2.5 text-white"
                            strokeWidth={3}
                          />
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 min-w-0">
                      <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                        {(lead.firstName?.[0] ?? "?").toUpperCase()}
                      </div>
                      <span className="text-sm font-medium truncate">
                        {lead.firstName} {lead.lastName ?? ""}
                      </span>
                    </div>

                    <span className="text-xs text-muted-foreground truncate">
                      {lead.email}
                    </span>

                    <span className="text-xs text-muted-foreground truncate">
                      {lead.orgName ?? (
                        <span className="italic opacity-50">—</span>
                      )}
                    </span>
                  </button>
                );
              })
            )}
          </div>

          {!isPending && leads.length > 0 && (
            <div className="px-3 py-2 border-t bg-muted/20 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {filtered.length} of {leads.length} lead
                {leads.length !== 1 ? "s" : ""}
                {search ? " match" : ""}
              </span>
              {selectedLeads.length > 0 && (
                <span className="text-xs font-medium text-primary">
                  {selectedLeads.length} selected
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <Button variant="outline" type="button" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={
            isCreating || !form.formState.isValid || selectedLeads.length === 0
          }
        >
          {isCreating
            ? "Creating…"
            : `Create Group${selectedLeads.length > 0 ? ` (${selectedLeads.length})` : ""}`}
        </Button>
      </div>
    </form>
  );
};
