import { useCallback, useRef, useState } from "react";
import { Upload, X, CheckCircle2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { formatBytes, getFileIcon } from "./attachments-utils";

import { cn } from "@/lib/utils";

import { useCreateAttachment } from "@/hooks";

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

type UploadStatus = "idle" | "uploading" | "success" | "error";

interface StagedFile {
  file: File;
  previewUrl?: string;
  status: UploadStatus;
  error?: string;
}

interface AttachmentUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadId: string;
}

export const AttachmentUploadModal = ({
  open,
  onOpenChange,
  leadId,
}: AttachmentUploadModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [staged, setStaged] = useState<StagedFile[]>([]);

  const { mutateAsync, isPending } = useCreateAttachment();

  const stageFiles = useCallback((files: FileList | File[]) => {
    const incoming = Array.from(files);
    const valid: StagedFile[] = [];

    for (const file of incoming) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`"${file.name}" exceeds the 25 MB limit.`);
        continue;
      }

      const previewUrl = file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : undefined;

      valid.push({ file, previewUrl, status: "idle" });
    }

    setStaged((prev) => [...prev, ...valid]);
  }, []);

  const removeStaged = (idx: number) => {
    setStaged((prev) => {
      const next = [...prev];
      const removed = next.splice(idx, 1)[0];
      if (removed.previewUrl) URL.revokeObjectURL(removed.previewUrl);
      return next;
    });
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length) stageFiles(e.dataTransfer.files);
  };

  const handleUploadAll = async () => {
    if (staged.length === 0) return;

    let successCount = 0;

    for (let i = 0; i < staged.length; i++) {
      if (staged[i].status !== "idle") continue;

      setStaged((prev) =>
        prev.map((s, idx) => (idx === i ? { ...s, status: "uploading" } : s)),
      );

      try {
        await mutateAsync({
          type: "attachments",
          leadId,
          file: staged[i].file,
        });
        successCount++;
        setStaged((prev) =>
          prev.map((s, idx) => (idx === i ? { ...s, status: "success" } : s)),
        );
      } catch (err) {
        setStaged((prev) =>
          prev.map((s, idx) =>
            idx === i
              ? {
                  ...s,
                  status: "error",
                  error: err instanceof Error ? err.message : "Upload failed",
                }
              : s,
          ),
        );
        toast.error(err instanceof Error ? err.message : "Upload failed");
      }
    }

    if (successCount > 0) {
      toast.success(
        successCount === 1
          ? "File uploaded successfully."
          : `${successCount} file(s) uploaded successfully.`,
      );
    }
  };

  const handleClose = (value: boolean) => {
    if (!value) {
      staged.forEach((s) => {
        if (s.previewUrl) URL.revokeObjectURL(s.previewUrl);
      });
      setStaged([]);
    }
    onOpenChange(value);
  };

  const allDone =
    staged.length > 0 && staged.every((s) => s.status === "success");
  const hasPending = staged.some((s) => s.status === "idle");

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Upload Attachments</DialogTitle>
          <DialogDescription>
            Drag &amp; drop files here or click to browse. Max 25 MB per file.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-1">
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) =>
              e.key === "Enter" && fileInputRef.current?.click()
            }
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={cn(
              "relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 cursor-pointer transition-colors select-none",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30",
            )}
          >
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full transition-colors",
                isDragging ? "bg-primary/10" : "bg-muted",
              )}
            >
              <Upload
                className={cn(
                  "h-6 w-6 transition-colors",
                  isDragging ? "text-primary" : "text-muted-foreground",
                )}
              />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">
                {isDragging ? "Release to add files" : "Drop files here"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                or{" "}
                <span className="text-primary underline underline-offset-2">
                  browse
                </span>{" "}
                to choose
              </p>
            </div>
            <input
              ref={fileInputRef}
              id="attachment-file-input"
              type="file"
              multiple
              className="sr-only"
              aria-hidden="true"
              onChange={(e) => {
                if (e.target.files) stageFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </div>

          {staged.length > 0 && (
            <ul className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {staged.map((s, idx) => (
                <li
                  key={idx}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors",
                    s.status === "success" &&
                      "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30",
                    s.status === "error" &&
                      "border-destructive/30 bg-destructive/5",
                    s.status === "uploading" && "opacity-70",
                  )}
                >
                  {s.previewUrl ? (
                    <img
                      src={s.previewUrl}
                      className="h-8 w-8 rounded object-cover shrink-0"
                    />
                  ) : (
                    <span className="shrink-0">{getFileIcon(s.file.type)}</span>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium">{s.file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatBytes(s.file.size)}
                      {s.status === "uploading" && " · Uploading…"}
                      {s.status === "error" && (
                        <span className="text-destructive">
                          {" "}
                          · {s.error ?? "Error"}
                        </span>
                      )}
                    </p>
                  </div>

                  {s.status === "success" && (
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500 shrink-0" />
                  )}
                  {s.status === "error" && (
                    <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                  )}
                  {(s.status === "idle" || s.status === "error") && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeStaged(idx);
                      }}
                      className="shrink-0 rounded-sm p-0.5 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}

          <div className="flex items-center justify-end gap-2 pt-1">
            <Button
              variant="outline"
              onClick={() => handleClose(false)}
              disabled={isPending}
            >
              {allDone ? "Close" : "Cancel"}
            </Button>

            {!allDone && (
              <Button
                id="upload-attachments-btn"
                onClick={handleUploadAll}
                disabled={!hasPending || isPending}
              >
                <Upload className="h-4 w-4" />
                {isPending ? "Uploading…" : "Upload"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
