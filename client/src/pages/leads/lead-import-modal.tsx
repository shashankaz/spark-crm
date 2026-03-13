import { useState, useRef } from "react";
import toast from "react-hot-toast";
import {
  Upload,
  CheckCircle2,
  Loader2,
  Download,
  FileSpreadsheet,
  AlertCircle,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useImportLeads } from "@/hooks";

interface LeadImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ACCEPTED_TYPES = [
  "text/csv",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];
const ACCEPTED_EXTS = [".csv", ".xlsx", ".xls"];

const isValidFile = (file: File) => {
  const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  return ACCEPTED_TYPES.includes(file.type) || ACCEPTED_EXTS.includes(ext);
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export function LeadImportModal({ open, onOpenChange }: LeadImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [result, setResult] = useState<{
    inserted: number;
    failed: number;
    failedLeadIds: string[];
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate, isPending } = useImportLeads();

  const handleFile = (selected: File) => {
    if (!isValidFile(selected)) {
      toast.error("Only CSV or Excel (.xlsx / .xls) files are allowed.");
      return;
    }

    if (selected.size > 10 * 1024 * 1024) {
      toast.error("File must be under 10 MB.");
      return;
    }

    setFile(selected);
    setResult(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) handleFile(selected);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) handleFile(dropped);
  };

  const handleUpload = () => {
    if (!file) {
      toast.error("Please select a file first.");
      return;
    }

    mutate(
      { file },
      {
        onSuccess: ({ inserted, failed, failedLeadIds }) => {
          setResult({ inserted, failed, failedLeadIds });
          setFile(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        },
        onError: ({ message }) => {
          toast.error(message);
        },
      },
    );
  };

  const handleClose = () => {
    if (isPending) return;
    setFile(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onOpenChange(false);
  };

  const fileExt = file?.name
    .slice(file.name.lastIndexOf(".") + 1)
    .toUpperCase();

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Import Leads
          </DialogTitle>
          <DialogDescription>
            Upload a CSV or Excel file to bulk-import leads into your CRM.
          </DialogDescription>
        </DialogHeader>

        {result ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-4">
              <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-base font-semibold">Import complete!</p>
              <p className="text-sm text-muted-foreground mt-1">
                Your leads have been processed successfully.
              </p>
            </div>

            <div className="w-full grid grid-cols-2 gap-3">
              <div className="rounded-lg border bg-muted/40 p-3 text-center">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {result.inserted}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">Inserted</p>
              </div>
              <div className="rounded-lg border bg-muted/40 p-3 text-center">
                <p className="text-2xl font-bold text-destructive">
                  {result.failed}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">Failed</p>
              </div>
            </div>

            {result.failedLeadIds.length > 0 && (
              <div className="w-full rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-left">
                <div className="flex items-center gap-1.5 mb-2">
                  <AlertCircle className="h-3.5 w-3.5 text-destructive" />
                  <p className="text-xs font-semibold text-destructive">
                    Failed rows ({result.failedLeadIds.length})
                  </p>
                </div>
                <ul className="text-xs text-muted-foreground space-y-0.5 max-h-28 overflow-y-auto">
                  {result.failedLeadIds.map((id, i) => (
                    <li key={i} className="truncate font-mono">
                      {id}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button className="w-full mt-2" onClick={handleClose}>
              Done
            </Button>
          </div>
        ) : (
          <div className="space-y-5 py-2">
            <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
              <FileSpreadsheet className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  Need the template?
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Download the official import template to ensure your data is
                  formatted correctly.
                </p>
              </div>
              <a
                href="/sample/lead-import-template.xlsx"
                download="lead-import-template.xlsx"
                className="shrink-0"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 whitespace-nowrap"
                >
                  <Download className="h-3.5 w-3.5" />
                  Template
                </Button>
              </a>
            </div>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
                dragOver
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-muted/40"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onChange={handleFileChange}
                className="sr-only"
                disabled={isPending}
              />
              <div className="rounded-full bg-muted p-3">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  Drop your file here, or{" "}
                  <span className="text-primary underline underline-offset-2">
                    browse
                  </span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Supports CSV and Excel · Max 10 MB
                </p>
              </div>
            </div>

            {file && (
              <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2">
                <FileSpreadsheet className="h-4 w-4 text-primary shrink-0" />
                <span className="text-sm font-medium truncate flex-1">
                  {file.name}
                </span>
                <Badge variant="secondary" className="text-[10px] shrink-0">
                  {fileExt}
                </Badge>
                <span className="text-xs text-muted-foreground shrink-0">
                  {formatFileSize(file.size)}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="ml-1 rounded-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            <DialogFooter className="gap-2 pt-1">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={isPending || !file}>
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Import Leads
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
