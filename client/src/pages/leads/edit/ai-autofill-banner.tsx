import { useState } from "react";
import toast from "react-hot-toast";
import type { useForm } from "react-hook-form";
import { Sparkles, X, CheckCheck, AlertCircle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import type { LeadFormValues } from "../lead-form-schema";

import { useResearchLead } from "@/hooks";

import type { LeadResearchResult } from "@/types/services/lead.service.types";

const VALID_SOURCES = [
  "website",
  "facebook ads",
  "google ads",
  "instagram",
  "linkedin",
  "email marketing",
  "referral",
  "cold call",
  "whatsApp",
  "other",
] as const;

type ValidSource = (typeof VALID_SOURCES)[number];

const normaliseSource = (raw?: string): ValidSource | undefined => {
  if (!raw) return undefined;

  const lower = raw.toLowerCase().trim();

  return (VALID_SOURCES as readonly string[]).includes(lower)
    ? (lower as ValidSource)
    : "other";
};

interface AIAutofillBannerProps {
  form: ReturnType<typeof useForm<LeadFormValues>>;
}

export const AIAutofillBanner: React.FC<AIAutofillBannerProps> = ({ form }) => {
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const [researchResult, setResearchResult] =
    useState<LeadResearchResult | null>(null);

  const { mutate: researchMutate, isPending: isResearching } =
    useResearchLead();

  const handleResearch = () => {
    const query = aiQuery.trim();
    if (!query) {
      toast.error("Please enter a name, company or other identifying details");
      return;
    }

    researchMutate(
      { query },
      {
        onSuccess: ({ result, message }) => {
          setResearchResult(result);
          toast.success(message);
        },
        onError: ({ message }) => {
          toast.error(message);
        },
      },
    );
  };

  const applyResearch = () => {
    if (!researchResult) return;

    const source = normaliseSource(researchResult.source);

    form.setValue("firstName", researchResult.firstName, {
      shouldDirty: true,
      shouldValidate: true,
    });
    if (researchResult.lastName)
      form.setValue("lastName", researchResult.lastName, {
        shouldDirty: true,
        shouldValidate: true,
      });

    const isPlaceholderEmail =
      researchResult.email.includes("not-found") ||
      researchResult.email.includes("unknown");
    if (!isPlaceholderEmail)
      form.setValue("email", researchResult.email, {
        shouldDirty: true,
        shouldValidate: true,
      });

    const isPlaceholderMobile =
      researchResult.mobile === "0000000000" ||
      researchResult.mobile.includes("not-found");
    const cleanMobile = researchResult.mobile.replace(/\D/g, "").slice(-10);
    if (!isPlaceholderMobile && cleanMobile.length === 10)
      form.setValue("mobile", cleanMobile, {
        shouldDirty: true,
        shouldValidate: true,
      });

    if (researchResult.gender)
      form.setValue("gender", researchResult.gender, {
        shouldDirty: true,
        shouldValidate: true,
      });

    if (source)
      form.setValue("source", source, {
        shouldDirty: true,
        shouldValidate: true,
      });

    toast.success("Fields filled from research — review and save");

    setAiPanelOpen(false);
    setResearchResult(null);
    setAiQuery("");
  };

  return (
    <div className="rounded-lg border border-dashed border-primary/40 bg-primary/5 px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Sparkles className="h-4 w-4 text-primary shrink-0" />
          <p className="text-sm font-medium text-primary">AI Lead Research</p>
          <p className="text-xs text-muted-foreground hidden sm:block">
            — search the web and auto-fill this lead's details
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant={aiPanelOpen ? "secondary" : "default"}
          onClick={() => {
            setAiPanelOpen((o) => !o);
            setResearchResult(null);
          }}
        >
          {aiPanelOpen ? (
            <>
              <X className="h-3.5 w-3.5" />
              Close
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5" />
              Research Lead
            </>
          )}
        </Button>
      </div>

      {aiPanelOpen && (
        <div className="mt-4 space-y-4">
          <div className="flex gap-2">
            <Input
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleResearch()}
              placeholder='e.g. "John Smith, CEO at Acme Corp" or "john@acme.com"'
              className="flex-1"
              disabled={isResearching}
            />
            <Button
              type="button"
              onClick={handleResearch}
              disabled={isResearching || !aiQuery.trim()}
            >
              {isResearching ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Researching…
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  Search
                </>
              )}
            </Button>
          </div>

          {researchResult && (
            <div className="rounded-lg border bg-card p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-semibold">Research Results</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {researchResult.summary}
                  </p>
                </div>
                <Badge
                  variant={
                    researchResult.score >= 70
                      ? "default"
                      : researchResult.score >= 40
                        ? "secondary"
                        : "outline"
                  }
                  className="shrink-0"
                >
                  Score {researchResult.score}/100
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
                {researchResult.firstName && (
                  <Row label="First Name" value={researchResult.firstName} />
                )}
                {researchResult.lastName && (
                  <Row label="Last Name" value={researchResult.lastName} />
                )}
                {researchResult.email &&
                  !researchResult.email.includes("not-found") && (
                    <Row label="Email" value={researchResult.email} />
                  )}
                {researchResult.mobile &&
                  researchResult.mobile !== "0000000000" && (
                    <Row label="Mobile" value={researchResult.mobile} />
                  )}
                {researchResult.gender && (
                  <Row
                    label="Gender"
                    value={
                      researchResult.gender.charAt(0).toUpperCase() +
                      researchResult.gender.slice(1)
                    }
                  />
                )}
                {researchResult.orgName && (
                  <Row label="Company" value={researchResult.orgName} />
                )}
                {researchResult.source && (
                  <Row label="Source" value={researchResult.source} />
                )}
              </div>

              {researchResult.score < 40 && (
                <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  Low confidence — verify fields manually before saving
                </div>
              )}

              <div className="flex justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setResearchResult(null);
                    setAiQuery("");
                  }}
                >
                  Discard
                </Button>
                <Button type="button" size="sm" onClick={applyResearch}>
                  <CheckCheck className="h-3.5 w-3.5" />
                  Apply to Form
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-baseline gap-1.5">
    <span className="text-muted-foreground shrink-0">{label}:</span>
    <span className="font-medium truncate">{value}</span>
  </div>
);
