import { Image, FileText, File } from "lucide-react";
import type { ReactElement } from "react";

export const getFileIcon = (fileType: string): ReactElement => {
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
