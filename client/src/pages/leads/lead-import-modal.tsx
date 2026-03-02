import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { Upload, CheckCircle2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { useImportLeads } from "@/hooks";

interface LeadImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LeadImportModal({ open, onOpenChange }: LeadImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [result, setResult] = useState<{
    inserted: number;
    failed: number;
    failedLeadIds: string[];
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (
        selectedFile.type !== "text/csv" &&
        !selectedFile.name.endsWith(".csv")
      ) {
        toast.error("Please select a valid CSV file.");
        setFile(null);
        return;
      }

      setFile(selectedFile);
      setStatus("idle");
      setResult(null);
    }
  };

  const { mutate, isPending } = useImportLeads();

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first.");
      return;
    }

    mutate(
      { file: file! },
      {
        onSuccess: ({ message }) => {
          toast.success(message);
          setStatus("success");
        },
        onError: ({ message }) => {
          toast.error(message);
        },
        onSettled: () => {
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }

          setFile(null);
          setStatus("idle");
          setResult(null);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Import Leads
          </DialogTitle>
          <DialogDescription>
            Upload a CSV file to bulk import leads. Required columns: name,
            email, phone.
          </DialogDescription>
        </DialogHeader>

        {status === "success" && result ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <p className="text-base font-semibold">Import Complete!</p>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                Successfully inserted:{" "}
                <span className="font-semibold text-foreground">
                  {result.inserted}
                </span>
              </p>
              <p>
                Failed rows:{" "}
                <span className="font-semibold text-destructive">
                  {result.failed}
                </span>
              </p>
              {result.failedLeadIds && result.failedLeadIds.length > 0 && (
                <div className="mt-2 text-xs text-left bg-muted p-2 rounded-md max-h-32 overflow-y-auto w-full">
                  <p className="font-semibold mb-1">Failed identifiers:</p>
                  <ul className="list-disc pl-4">
                    {result.failedLeadIds.map((id, i) => (
                      <li key={i} className="truncate">
                        {id}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <Button className="mt-4 w-full" onClick={() => onOpenChange(false)}>
              Done
            </Button>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="flex flex-col gap-2">
              <Input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileChange}
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
              <Button onClick={handleUpload} disabled={isPending || !file}>
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
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
