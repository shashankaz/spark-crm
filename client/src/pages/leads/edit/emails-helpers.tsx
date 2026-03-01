import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Mail,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

import type { Email } from "@/types/domain";

export const StatusBadge = ({ status }: { status: Email["status"] }) => {
  if (status === "sent")
    return (
      <Badge variant="default" className="gap-1 text-xs">
        <CheckCircle2 className="h-3 w-3" /> Sent
      </Badge>
    );
  if (status === "failed")
    return (
      <Badge variant="destructive" className="gap-1 text-xs">
        <XCircle className="h-3 w-3" /> Failed
      </Badge>
    );
  return (
    <Badge variant="secondary" className="gap-1 text-xs">
      <Clock className="h-3 w-3" /> Draft
    </Badge>
  );
};

export const EmailCard = ({ email }: { email: Email }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => setExpanded((p: boolean) => !p)}
        role="button"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{email.subject}</p>
            <p className="text-xs text-muted-foreground truncate">
              To: {email.to}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <StatusBadge status={email.status} />
          <span className="text-xs text-muted-foreground hidden sm:block">
            {formatDistanceToNow(email.createdAt, { addSuffix: true })}
          </span>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t bg-muted/10">
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground py-2 border-b mb-3">
            <span>
              <strong>From:</strong> {email.from}
            </span>
            <span>
              <strong>To:</strong> {email.to}
            </span>
            {email.createdAt && (
              <span>
                <strong>Sent:</strong>{" "}
                {new Date(email.createdAt).toLocaleString()}
              </span>
            )}
          </div>
          <div
            className="text-sm rich-editor-content"
            dangerouslySetInnerHTML={{ __html: email.bodyHtml }}
          />
        </div>
      )}
    </div>
  );
};
