import { useState, useRef } from "react";
import { useParams } from "react-router";
import toast from "react-hot-toast";
import { Send, Mail, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { RichEditor } from "@/components/shared/rich-editor";

import { EmailCard } from "./emails-helpers";

import { useEmails, useSendEmail } from "@/hooks";

export const EmailsTab = ({ fullName }: { fullName: string }) => {
  const { leadId } = useParams<{ leadId: string }>();

  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [showCompose, setShowCompose] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);

  const { data: emailsData } = useEmails({
    leadId: leadId!,
    enabled: true,
  });
  const emails = emailsData?.emails ?? [];

  const { mutate: sendEmail, isPending } = useSendEmail();

  const handleSend = () => {
    if (!to.trim()) {
      toast.error("Please enter a recipient email address.");
      return;
    }

    if (!subject.trim()) {
      toast.error("Please enter a subject.");
      return;
    }

    const html = editorRef.current?.innerHTML ?? "";
    const text = editorRef.current?.textContent?.trim() ?? "";
    if (!text) {
      toast.error("Email body cannot be empty.");
      return;
    }

    sendEmail(
      {
        leadId: leadId!,
        to: to.trim(),
        subject: subject.trim(),
        bodyHtml: html,
        bodyText: text,
      },
      {
        onSuccess: ({ message }) => {
          toast.success(message);
          setTo("");
          setSubject("");
          if (editorRef.current) editorRef.current.innerHTML = "";
          setShowCompose(false);
        },
        onError: ({ message }) => {
          toast.error(message);
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Emails</h2>
          <p className="text-muted-foreground text-sm">
            Send and track emails to {fullName}
          </p>
        </div>
        <Button
          type="button"
          onClick={() => setShowCompose((p: boolean) => !p)}
          variant={showCompose ? "outline" : "default"}
        >
          {showCompose ? (
            <XCircle className="h-3.5 w-3.5" />
          ) : (
            <Mail className="h-3.5 w-3.5" />
          )}
          {showCompose ? "Cancel" : "Compose Email"}
        </Button>
      </div>

      {showCompose && (
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b bg-muted/30 flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-sm">New Email</span>
          </div>

          <div className="px-4 pt-4 space-y-2">
            <div className="flex items-center gap-3 border-b pb-2">
              <span className="text-xs font-semibold text-muted-foreground w-14 shrink-0">
                To
              </span>
              <Input
                id="email-to"
                type="email"
                placeholder="recipient@example.com"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="border-0 shadow-none focus-visible:ring-0 h-7 px-0 text-sm"
              />
            </div>
            <div className="flex items-center gap-3 border-b pb-2">
              <span className="text-xs font-semibold text-muted-foreground w-14 shrink-0">
                Subject
              </span>
              <Input
                id="email-subject"
                type="text"
                placeholder="Email subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="border-0 shadow-none focus-visible:ring-0 h-7 px-0 text-sm"
              />
            </div>
          </div>

          <div className="px-4 pt-3 pb-0">
            <RichEditor editorRef={editorRef} />
          </div>

          <div className="flex items-center justify-end gap-2 px-4 py-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowCompose(false)}
              disabled={isPending}
            >
              Discard
            </Button>
            <Button
              id="send-email-btn"
              type="button"
              size="sm"
              disabled={isPending}
              onClick={handleSend}
            >
              <Send className="h-3.5 w-3.5" />
              {isPending ? "Sending..." : "Send Email"}
            </Button>
          </div>
        </div>
      )}

      {emails.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center gap-3">
          <Mail className="h-8 w-8 text-muted-foreground/50" />
          <div>
            <p className="text-muted-foreground text-sm font-medium">
              No emails yet
            </p>
            <p className="text-muted-foreground text-xs mt-1">
              Compose an email to {fullName} to get started.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCompose(true)}
          >
            <Mail className="h-3.5 w-3.5" />
            Compose First Email
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {emails.map((email) => (
            <EmailCard key={email._id} email={email} />
          ))}
        </div>
      )}
    </div>
  );
};
