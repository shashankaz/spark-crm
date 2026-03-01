import { useState } from "react";
import { useParams } from "react-router";
import { Paperclip, Plus, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useAttachments } from "@/hooks";

import { AttachmentUploadModal } from "./attachment-upload-modal";
import { AttachmentCard } from "./attachments-helpers";

interface AttachmentsTabProps {
  fullName: string;
}

export const AttachmentsTab = ({ fullName }: AttachmentsTabProps) => {
  const { leadId } = useParams<{ leadId: string }>();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const { data, isPending } = useAttachments({
    leadId: leadId!,
    enabled: true,
  });
  const attachments = data?.attachments ?? [];

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Attachments</h2>
            <p className="text-muted-foreground text-sm">
              Files and documents for {fullName}
            </p>
          </div>
          <Button
            id="open-upload-modal-btn"
            type="button"
            onClick={() => setUploadModalOpen(true)}
          >
            <Plus />
            Add Files
          </Button>
        </div>

        {isPending ? (
          <div className="flex items-center justify-center py-16 gap-2 text-muted-foreground text-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading attachments…
          </div>
        ) : attachments.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center gap-3">
            <Paperclip className="h-8 w-8 text-muted-foreground/50" />
            <div>
              <p className="text-sm font-medium">No attachments yet</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Upload files to keep everything in one place.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setUploadModalOpen(true)}
            >
              <Plus />
              Upload First File
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {attachments.map((attachment) => (
              <AttachmentCard key={attachment._id} attachment={attachment} />
            ))}
          </div>
        )}
      </div>

      <AttachmentUploadModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        leadId={leadId!}
      />
    </>
  );
};
