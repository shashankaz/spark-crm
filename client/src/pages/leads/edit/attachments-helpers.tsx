import { formatDate } from "date-fns";
import { Download, FileText, Image, File } from "lucide-react";

import { cn } from "@/lib/utils";

import type { IAttachment } from "@/types/domain/attachment";

export const getFileIcon = (fileType: string) => {
  if (fileType.startsWith("image/"))
    return <Image className="h-5 w-5 text-blue-500" />;
  if (fileType === "application/pdf")
    return <FileText className="h-5 w-5 text-red-500" />;
  if (fileType.includes("word") || fileType.includes("document"))
    return <FileText className="h-5 w-5 text-blue-600" />;
  if (fileType.includes("sheet") || fileType.includes("excel"))
    return <FileText className="h-5 w-5 text-green-600" />;
  return <File className="h-5 w-5 text-muted-foreground" />;
};

export const getExtension = (fileName: string): string => {
  const parts = fileName.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : "FILE";
};

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export const AttachmentCard = ({ attachment }: { attachment: IAttachment }) => {
  const isImage = attachment.fileType.startsWith("image/");

  return (
    <div className="group flex items-center gap-3 rounded-lg border px-4 py-3 hover:bg-muted/30 transition-colors">
      {isImage ? (
        <div className="h-10 w-10 shrink-0 rounded-md overflow-hidden border bg-muted">
          <img
            src={attachment.fileUrl}
            alt={attachment.fileName}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      ) : (
        <div className="h-10 w-10 shrink-0 rounded-md border bg-muted flex items-center justify-center">
          {getFileIcon(attachment.fileType)}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" title={attachment.fileName}>
          {attachment.fileName}
        </p>
        <p className="text-xs text-muted-foreground">
          <span className="uppercase font-mono tracking-wide">
            {getExtension(attachment.fileName)}
          </span>
          {" · "}
          {formatDate(attachment.createdAt, "dd/MM/yyyy")}
        </p>
      </div>

      <a
        href={attachment.fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        download={attachment.fileName}
        className={cn(
          "shrink-0 rounded-md p-1.5 text-muted-foreground hover:text-foreground",
          "hover:bg-muted transition-colors opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
        )}
      >
        <Download className="h-4 w-4" />
      </a>
    </div>
  );
};
