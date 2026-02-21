import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { Helmet } from "react-helmet-async";
import {
  ArrowRightCircle,
  Clock,
  FileEdit,
  MessageSquare,
  Phone,
  PhoneIncoming,
  PhoneOff,
  PhoneOutgoing,
  Plus,
  Trash2,
} from "lucide-react";

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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Heading } from "@/components/shared/typography/heading";
import { Description } from "@/components/shared/typography/description";
import { LeadEditForm } from "./lead-edit-form";
import type { LeadEditData } from "./lead-edit-form";
import { CallLogCreateForm } from "./call-log-create-form";
import type { CallLogFormValues } from "./call-log-form-schema";
import { CommentCreateForm } from "./comment-create-form";
import type { CommentFormValues } from "./comment-form-schema";

interface CallLog extends CallLogFormValues {
  id: string;
  createdAt: string;
}

interface Comment extends CommentFormValues {
  id: string;
  createdAt: string;
}

function formatDuration(seconds: number): string {
  if (seconds === 0) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return s === 0 ? `${m}m` : `${m}m ${s}s`;
}

type ActivityEventType =
  | "lead_opened"
  | "call_logged"
  | "call_deleted"
  | "comment_added"
  | "comment_deleted";

interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  description: string;
  createdAt: string;
}

function timeAgo(iso: string): string {
  const secs = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (secs < 5) return "just now";
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal"
  | "negotiation"
  | "won"
  | "lost";

const LEAD_STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "proposal", label: "Proposal Sent" },
  { value: "negotiation", label: "Negotiation" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];

function getActivityStyle(type: ActivityEventType): {
  dot: string;
  icon: React.ReactNode;
} {
  switch (type) {
    case "lead_opened":
      return {
        dot: "bg-emerald-500 border-emerald-500",
        icon: <FileEdit className="h-2 w-2 text-white" />,
      };
    case "call_logged":
      return {
        dot: "bg-violet-500 border-violet-500",
        icon: <Phone className="h-2 w-2 text-white" />,
      };
    case "call_deleted":
      return {
        dot: "bg-destructive border-destructive",
        icon: <PhoneOff className="h-2 w-2 text-white" />,
      };
    case "comment_added":
      return {
        dot: "bg-blue-500 border-blue-500",
        icon: <MessageSquare className="h-2 w-2 text-white" />,
      };
    case "comment_deleted":
      return {
        dot: "bg-destructive border-destructive",
        icon: <Trash2 className="h-2 w-2 text-white" />,
      };
  }
}

const MOCK_LEADS: LeadEditData[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    mobile: "9876543210",
    gender: "Male",
    organization: "f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
    source: "Website",
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    mobile: "9001234567",
    gender: "Female",
    organization: "f81d4fae-7dec-11d0-a765-00a0c91e6bf7",
    source: "LinkedIn",
  },
  {
    id: "3",
    firstName: "Carlos",
    lastName: "Martinez",
    email: "carlos.martinez@initech.com",
    mobile: "9123456780",
    gender: "Male",
    organization: "f81d4fae-7dec-11d0-a765-00a0c91e6bf8",
    source: "Referral",
  },
  {
    id: "4",
    firstName: "Priya",
    lastName: "Sharma",
    email: "priya.sharma@umbrella.com",
    mobile: "9988776655",
    gender: "Female",
    organization: "f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
    source: "Cold Call",
  },
  {
    id: "5",
    firstName: "Liam",
    lastName: "O'Brien",
    email: "liam.obrien@stark.com",
    mobile: "9871234560",
    gender: "Male",
    organization: "f81d4fae-7dec-11d0-a765-00a0c91e6bf7",
    source: "Google Ads",
  },
];

const LeadsEditPage = () => {
  const { leadId } = useParams<{ leadId: string }>();
  const navigate = useNavigate();

  const lead = MOCK_LEADS.find((l) => l.id === leadId);
  const [leadStatus, setLeadStatus] = useState<LeadStatus>("new");
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [callDialogOpen, setCallDialogOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [activities, setActivities] = useState<ActivityEvent[]>(() => [
    {
      id: "activity-init",
      type: "lead_opened",
      description: "Lead record opened",
      createdAt: new Date().toISOString(),
    },
  ]);

  const pushActivity = (event: Omit<ActivityEvent, "id" | "createdAt">) => {
    setActivities((prev) => [
      {
        id: `activity-${Date.now()}`,
        createdAt: new Date().toISOString(),
        ...event,
      },
      ...prev,
    ]);
  };

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

  const handleAddCallLog = (data: CallLogFormValues) => {
    const newLog: CallLog = {
      id: `call-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...data,
    };
    setCallLogs((prev) => [newLog, ...prev]);
    pushActivity({
      type: "call_logged",
      description: `${data.type === "inbound" ? "Inbound" : "Outbound"} call logged · ${data.status}`,
    });
  };

  const handleDeleteCallLog = (id: string) => {
    setCallLogs((prev) => prev.filter((c) => c.id !== id));
    pushActivity({ type: "call_deleted", description: "Call log removed" });
  };

  const handleAddComment = (data: CommentFormValues) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...data,
    };
    setComments((prev) => [newComment, ...prev]);
    pushActivity({ type: "comment_added", description: "Comment posted" });
  };

  const handleDeleteComment = (id: string) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
    pushActivity({ type: "comment_deleted", description: "Comment deleted" });
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
                  <Select
                    value={leadStatus}
                    onValueChange={(v) => setLeadStatus(v as LeadStatus)}
                  >
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
                  {callLogs.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="comments">
                Comments
                <span className="ml-1.5 rounded-full bg-muted text-muted-foreground text-xs px-1.5 py-0.5">
                  {comments.length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-6">
              <LeadEditForm lead={lead} />
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

                {callLogs.length === 0 ? (
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
                    {callLogs.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-center justify-between px-4 py-3 gap-4"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="shrink-0">
                            {log.type === "inbound" ? (
                              <PhoneIncoming className="h-4 w-4 text-blue-500" />
                            ) : (
                              <PhoneOutgoing className="h-4 w-4 text-violet-500" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">
                              {log.from}{" "}
                              <span className="text-muted-foreground font-normal">
                                → {log.to}
                              </span>
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(log.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <Badge
                            variant={
                              log.type === "inbound" ? "secondary" : "outline"
                            }
                            className="capitalize text-xs"
                          >
                            {log.type}
                          </Badge>
                          <Badge
                            variant={
                              log.status === "completed"
                                ? "default"
                                : log.status === "missed"
                                  ? "destructive"
                                  : "secondary"
                            }
                            className="capitalize text-xs"
                          >
                            {log.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground w-12 text-right">
                            {formatDuration(log.duration)}
                          </span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-destructive hover:text-destructive"
                                onClick={() => handleDeleteCallLog(log.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete log</TooltipContent>
                          </Tooltip>
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

                <CommentCreateForm onAdd={handleAddComment} />

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
                      <div
                        key={c.id}
                        className="rounded-lg border px-4 py-3 flex items-start justify-between gap-3"
                      >
                        <div className="space-y-1 min-w-0">
                          <p className="text-sm whitespace-pre-wrap break-words">
                            {c.comment}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(c.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 shrink-0 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteComment(c.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete comment</TooltipContent>
                        </Tooltip>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="activity" className="mt-6" />
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
                  const { dot, icon } = getActivityStyle(event.type);
                  return (
                    <li key={event.id} className="relative pl-6 pb-5 last:pb-0">
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
                        {event.description}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {timeAgo(event.createdAt)}
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
          <CallLogCreateForm
            setOpen={setCallDialogOpen}
            onAdd={handleAddCallLog}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LeadsEditPage;
