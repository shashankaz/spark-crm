import { useState } from "react";
import toast from "react-hot-toast";
import { Mail, CheckCircle2, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { useExportOrganizations } from "@/hooks";

import type { Organization } from "@/types/domain";

interface OrganizationExportModalProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  selectedOrganizations: Organization[];
}

export const OrganizationExportModal: React.FC<
  OrganizationExportModalProps
> = ({ open, onOpenChange, selectedOrganizations }) => {
  const [exportEmail, setExportEmail] = useState("");
  const [exportStatus, setExportStatus] = useState<"idle" | "sending" | "sent">(
    "idle",
  );

  const { mutate, isPending } = useExportOrganizations();

  const handleExportSubmit = () => {
    setExportStatus("sending");

    mutate(
      {
        organizationIds: selectedOrganizations.map((org) => org._id),
        recipientEmail: exportEmail,
      },
      {
        onSuccess: ({ message }) => {
          toast.success(message);
          setExportStatus("sent");
          onOpenChange(false);
          setExportEmail("");
        },
        onError: ({ message }) => {
          toast.error(message);
        },
        onSettled: () => {
          setExportStatus("idle");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Export Organizations
          </DialogTitle>
          <DialogDescription>
            Enter an email address to receive the exported data for{" "}
            <span className="font-semibold text-foreground">
              {selectedOrganizations.length} organization
              {selectedOrganizations.length !== 1 ? "s" : ""}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        {exportStatus === "sent" ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <p className="text-base font-semibold">Export Successful!</p>
            <p className="text-sm text-muted-foreground">
              The exported data has been sent to{" "}
              <span className="font-medium text-foreground">{exportEmail}</span>
              . Please check your inbox.
            </p>
            <Button className="mt-2 w-full" onClick={() => onOpenChange(false)}>
              Done
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-2 py-2">
              <Label htmlFor="export-email">Email Address</Label>
              <Input
                id="export-email"
                type="email"
                placeholder="you@example.com"
                value={exportEmail}
                onChange={(e) => {
                  setExportEmail(e.target.value);
                }}
                disabled={isPending}
              />
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleExportSubmit}
                disabled={isPending || !exportEmail}
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    Export &amp; Send
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
