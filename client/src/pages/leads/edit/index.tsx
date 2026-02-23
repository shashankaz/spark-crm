import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import {
  ArrowRightCircle,
  Clock,
  MessageSquare,
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  Plus,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Heading } from "@/components/shared/typography/heading";
import { Description } from "@/components/shared/typography/description";

import { LeadEditForm } from "./lead-edit-form";
import type { LeadEditData } from "./lead-edit-form";
import { CallLogCreateForm } from "./call-log-create-form";
import { CommentCreateForm } from "./comment-create-form";
import { getActivityStyle } from "./helper";

import { useOrganizations } from "@/hooks/use-organization";
import { useCalls } from "@/hooks/use-call";
import { useComments } from "@/hooks/use-comment";
import { useLead, useLeadActivity, useUpdateLead } from "@/hooks/use-lead";

import type { LeadStatus } from "@/types/domain/lead";

const formatDuration = (seconds: number): string => {
  if (seconds === 0) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return s === 0 ? `${m}m` : `${m}m ${s}s`;
};

const LEAD_STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "converted", label: "Converted" },
  { value: "lost", label: "Lost" },
];

const LeadsEditPage = () => {
  const { leadId } = useParams<{ leadId: string }>();

  const navigate = useNavigate();

  const [callDialogOpen, setCallDialogOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<LeadStatus | null>(null);

  const { data: leadData, isPending } = useLead({ id: leadId! });
  const lead = leadData?.lead;

  const leadStatus: LeadStatus =
    pendingStatus ?? (lead?.status as LeadStatus) ?? "new";

  const { data: organizationsData } = useOrganizations({});
  const organizations = organizationsData?.organizations ?? [];

  const { data: callsData } = useCalls({ leadId: leadId! });
  const calls = callsData?.calls ?? [];

  const { data: commentsData } = useComments({ leadId: leadId! });
  const comments = commentsData?.comments ?? [];

  const { data: leadActivityData } = useLeadActivity({ id: leadId! });
  const activities = leadActivityData?.activities ?? [];

  const { mutate } = useUpdateLead();

  const updateStatus = (status: string) => {
    mutate(
      { id: leadId!, status },
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

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading lead...</p>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-muted-foreground">Lead not found.</p>
        <Button asChild variant="outline">
          <Link to="/dashboard/leads">Back to Leads</Link>
        </Button>
      </div>
    );
  }

  const fullName = [lead.firstName, lead.lastName].filter(Boolean).join(" ");

  const leadEditData: LeadEditData = {
    id: lead._id,
    firstName: lead.firstName,
    lastName: lead.lastName,
    email: lead.email,
    mobile: lead.mobile,
    gender: lead.gender as LeadEditData["gender"],
    organization: lead.orgId ?? "",
    source: (lead.source ?? "") as LeadEditData["source"],
  };

  const handleStatusChange = (value: string) => {
    setPendingStatus(value as LeadStatus);
    updateStatus(value);
  };

  return (
    <>
      <Helmet>
        <title>Edit {fullName} | Leads</title>
        <meta name="description" content={`Edit lead ${fullName}`} />
      </Helmet>

      <div className="flex gap-6 items-start">
        <div className="flex-1 min-w-0 space-y-6">
          <div className="border-b pb-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <Heading title={fullName} />
                  {lead.source && (
                    <Badge variant="secondary">{lead.source}</Badge>
                  )}
                </div>
                {lead.gender && (
                  <Description
                    description={`Gender: ${lead.gender}
                    ${lead.email && ` · ${lead.email}`}`}
                  />
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                    Status
                  </span>
                  <Select value={leadStatus} onValueChange={handleStatusChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LEAD_STATUS_OPTIONS.map((opt) => (
                        <SelectItem
                          key={opt.value.toLocaleLowerCase()}
                          value={opt.value}
                        >
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                    &nbsp;
                  </span>
                  <Button onClick={() => navigate("/dashboard/deals")}>
                    <ArrowRightCircle className="h-4 w-4" />
                    Convert to Deal
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="calls">
                Calls
                <span className="ml-1.5 rounded-full bg-muted text-muted-foreground text-xs px-1.5 py-0.5">
                  {calls.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="comments">
                Comments
                <span className="ml-1.5 rounded-full bg-muted text-muted-foreground text-xs px-1.5 py-0.5">
                  {comments.length}
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-6">
              <LeadEditForm lead={leadEditData} organizations={organizations} />
            </TabsContent>

            <TabsContent value="calls" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">Call Logs</h2>
                    <p className="text-muted-foreground text-sm">
                      Track all calls associated with {fullName}
                    </p>
                  </div>
                  <Button type="button" onClick={() => setCallDialogOpen(true)}>
                    <Plus />
                    Log Call
                  </Button>
                </div>

                {calls.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center gap-2">
                    <Phone className="h-8 w-8 text-muted-foreground/50" />
                    <p className="text-muted-foreground text-sm">
                      No call logs yet.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCallDialogOpen(true)}
                    >
                      <Plus />
                      Log First Call
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-lg border divide-y">
                    {calls.map((call) => (
                      <div
                        key={call._id}
                        className="flex items-center justify-between px-4 py-3 gap-4"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="shrink-0">
                            {call.type === "inbound" ? (
                              <PhoneIncoming className="h-4 w-4 text-blue-500" />
                            ) : (
                              <PhoneOutgoing className="h-4 w-4 text-violet-500" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">
                              {call.from}{" "}
                              <span className="text-muted-foreground font-normal">
                                → {call.to}
                              </span>
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(call.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <Badge
                            variant={
                              call.type === "inbound" ? "secondary" : "outline"
                            }
                            className="capitalize text-xs"
                          >
                            {call.type}
                          </Badge>
                          <Badge
                            variant={
                              call.status === "completed"
                                ? "default"
                                : call.status === "missed"
                                  ? "destructive"
                                  : "secondary"
                            }
                            className="capitalize text-xs"
                          >
                            {call.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground w-12 text-right">
                            {formatDuration(call.duration)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="comments" className="mt-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold">Comments</h2>
                  <p className="text-muted-foreground text-sm">
                    Leave notes and comments about {fullName}
                  </p>
                </div>

                <CommentCreateForm />

                {comments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center gap-2">
                    <MessageSquare className="h-8 w-8 text-muted-foreground/50" />
                    <p className="text-muted-foreground text-sm">
                      No comments yet. Be the first to add one.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {comments.map((c) => (
                      <div key={c._id} className="rounded-lg border px-4 py-3">
                        <div className="space-y-1 min-w-0">
                          <p className="text-sm whitespace-pre-wrap wrap-break-word">
                            {c.comment}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(c.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <aside className="w-64 shrink-0 sticky top-[calc(var(--header-height)+1rem)] rounded-lg border bg-card flex flex-col h-[calc(100vh-var(--header-height)-2rem)]">
          <div className="flex items-center gap-2 px-4 py-3 border-b shrink-0">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Activity</h2>
            <span className="ml-auto text-xs text-muted-foreground">
              {activities.length}
            </span>
          </div>
          <div className="overflow-y-auto flex-1 px-4 py-4">
            {activities.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-8">
                No activity yet
              </p>
            ) : (
              <ol className="space-y-0">
                {activities.map((event, idx) => {
                  const { dot, icon } = getActivityStyle(event.actionType);
                  return (
                    <li
                      key={event._id}
                      className="relative pl-6 pb-5 last:pb-0"
                    >
                      {idx < activities.length - 1 && (
                        <span className="absolute left-[9px] top-4 h-full w-px bg-border" />
                      )}
                      <span
                        className={cn(
                          "absolute left-0 top-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full border-2",
                          dot,
                        )}
                      >
                        {icon}
                      </span>
                      <p className="text-xs font-medium leading-snug">
                        {event.message}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {formatDistanceToNow(event.createdAt)}
                      </p>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        </aside>
      </div>

      <Dialog open={callDialogOpen} onOpenChange={setCallDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Log a Call</DialogTitle>
          </DialogHeader>
          <CallLogCreateForm setOpen={setCallDialogOpen} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LeadsEditPage;
