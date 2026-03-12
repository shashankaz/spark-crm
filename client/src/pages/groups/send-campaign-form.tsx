import { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { FileText, ChevronDown, Check, Tag, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RichEditor } from "@/components/shared/rich-editor";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { getTagColor } from "./get-tag-color";
import { campaignSchema } from "./campaign-schema";
import type { CampaignFormValues } from "./campaign-schema";

import { useSendCampaignGroup, useEmailTemplates } from "@/hooks";

import type { IEmailTemplate } from "@/types/domain";

interface SendCampaignFormProps {
  groupId: string;
  setOpen: (open: boolean) => void;
}

export const SendCampaignForm: React.FC<SendCampaignFormProps> = ({
  groupId,
  setOpen,
}) => {
  const { mutate, isPending } = useSendCampaignGroup();

  const editorRef = useRef<HTMLDivElement>(null);
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<IEmailTemplate | null>(null);
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [templateSearch, setTemplateSearch] = useState("");

  const { data: templatesData } = useEmailTemplates();
  const templates = templatesData?.templates ?? [];

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    mode: "onChange",
    defaultValues: {
      subject: "",
      bodyHtml: "",
    },
  });

  const applyTemplate = (template: IEmailTemplate) => {
    form.setValue("subject", template.subject, { shouldValidate: true });
    form.setValue("bodyHtml", template.bodyHtml, { shouldValidate: true });
    if (editorRef.current) {
      editorRef.current.innerHTML = template.bodyHtml;
    }
    setSelectedTemplate(template);
    setTemplatePickerOpen(false);
  };

  const clearTemplate = () => {
    setSelectedTemplate(null);
    form.setValue("subject", "", { shouldValidate: false });
    form.setValue("bodyHtml", "", { shouldValidate: false });
    if (editorRef.current) editorRef.current.innerHTML = "";
  };

  const onSubmit = (values: CampaignFormValues) => {
    mutate(
      {
        groupId,
        subject: values.subject,
        bodyHtml: values.bodyHtml,
      },
      {
        onSuccess: ({ message }) => {
          toast.success(message);
          form.reset();
          setOpen(false);
        },
        onError: ({ message }) => {
          toast.error(message);
        },
      },
    );
  };

  const allTags = Array.from(new Set(templates.flatMap((t) => t.tags))).sort();
  const filteredTemplates = templates.filter((t) => {
    const matchesSearch =
      !templateSearch ||
      t.name.toLowerCase().includes(templateSearch.toLowerCase()) ||
      t.subject.toLowerCase().includes(templateSearch.toLowerCase());
    const matchesTag = !tagFilter || t.tags.includes(tagFilter);
    return matchesSearch && matchesTag;
  });

  return (
    <>
      <form
        id="campaign-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <div className="rounded-lg border border-dashed bg-muted/30 p-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="rounded-md bg-primary/10 p-1.5 shrink-0">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            {selectedTemplate ? (
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">
                  {selectedTemplate.name}
                </p>
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {selectedTemplate.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`inline-flex items-center text-xs font-medium px-1.5 py-0 rounded-full border ${getTagColor({ tag })}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium">Use a template</p>
                <p className="text-xs text-muted-foreground">
                  {templates.length > 0
                    ? `${templates.length} template${templates.length !== 1 ? "s" : ""} available`
                    : "No templates yet — create some in the Templates tab"}
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {selectedTemplate && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground"
                onClick={clearTemplate}
                title="Clear template"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs h-8"
              onClick={() => setTemplatePickerOpen(true)}
              disabled={templates.length === 0}
            >
              {selectedTemplate ? "Change" : "Choose"}
              <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>

        <FieldGroup className="-space-y-4">
          <Controller
            name="subject"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="-space-y-2">
                <FieldLabel htmlFor="subject">
                  Subject <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  id="subject"
                  aria-invalid={fieldState.invalid}
                  placeholder="Campaign Subject"
                />
                {fieldState.invalid && (
                  <FieldError
                    className="text-destructive text-xs"
                    errors={[fieldState.error]}
                  />
                )}
              </Field>
            )}
          />
          <Controller
            name="bodyHtml"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="-space-y-2">
                <FieldLabel htmlFor="bodyHtml">
                  Message <span className="text-destructive">*</span>
                </FieldLabel>
                <RichEditor
                  editorRef={editorRef}
                  placeholder="Campaign Message"
                  defaultValue={field.value}
                  onChange={(html) => field.onChange(html)}
                />
                {fieldState.invalid && (
                  <FieldError
                    className="text-destructive text-xs"
                    errors={[fieldState.error]}
                  />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <div className="space-x-2 mt-4 flex justify-end">
          <Button
            variant="outline"
            type="button"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending || !form.formState.isValid}>
            {isPending ? "Sending..." : "Send Campaign"}
          </Button>
        </div>
      </form>

      <Dialog open={templatePickerOpen} onOpenChange={setTemplatePickerOpen}>
        <DialogContent className="max-w-xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Choose a Template</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 flex-1 overflow-hidden flex flex-col">
            <Input
              value={templateSearch}
              onChange={(e) => setTemplateSearch(e.target.value)}
              placeholder="Search templates…"
              className="shrink-0"
            />

            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 shrink-0">
                <button
                  onClick={() => setTagFilter(null)}
                  className={`text-xs px-2.5 py-0.5 rounded-full border font-medium transition-colors ${
                    tagFilter === null
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background text-muted-foreground border-border hover:border-foreground/50"
                  }`}
                >
                  All
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
                    className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full border font-medium transition-colors ${
                      tagFilter === tag
                        ? getTagColor({ tag })
                        : "bg-background text-muted-foreground border-border hover:border-foreground/50"
                    }`}
                  >
                    <Tag className="h-2.5 w-2.5" />
                    {tag}
                  </button>
                ))}
              </div>
            )}

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filteredTemplates.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-8">
                  No templates match your search.
                </p>
              ) : (
                filteredTemplates.map((template) => {
                  const isSelected = selectedTemplate?._id === template._id;
                  const preview = template.bodyHtml
                    .replace(/<[^>]*>/g, "")
                    .slice(0, 80);
                  return (
                    <button
                      key={template._id}
                      type="button"
                      onClick={() => applyTemplate(template)}
                      className={`w-full text-left rounded-lg border p-3 transition-all hover:shadow-sm ${
                        isSelected
                          ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                          : "border-border hover:border-primary/50 bg-card"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <p className="font-medium text-sm truncate">
                              {template.name}
                            </p>
                            {isSelected && (
                              <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">
                            {template.subject}
                          </p>
                          {preview && (
                            <p className="text-xs text-muted-foreground/70 truncate mt-1">
                              {preview}…
                            </p>
                          )}
                        </div>
                      </div>
                      {template.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {template.tags.map((tag) => (
                            <span
                              key={tag}
                              className={`inline-flex items-center text-xs font-medium px-1.5 py-0 rounded-full border ${getTagColor({ tag })}`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
