import { useState, useRef } from "react";
import { Tag, Check, X } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { RichEditor } from "@/components/shared/rich-editor";

import { getTagColor } from "./get-tag-color";

import type { IEmailTemplate } from "@/types/domain";
import type { CreateEmailTemplateRequest } from "@/types/services";

interface TemplateFormProps {
  initial?: Partial<IEmailTemplate>;
  onSave: (data: CreateEmailTemplateRequest) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export const TemplateForm: React.FC<TemplateFormProps> = ({
  initial,
  onSave,
  onCancel,
  isSaving = false,
}) => {
  const [name, setName] = useState(initial?.name ?? "");
  const [subject, setSubject] = useState(initial?.subject ?? "");
  const [bodyHtml, setBodyHtml] = useState(initial?.bodyHtml ?? "");
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setTagInput("");
  };

  const removeTag = (tag: string) =>
    setTags((prev) => prev.filter((t) => t !== tag));

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && !tagInput && tags.length) {
      setTags((prev) => prev.slice(0, -1));
    }
  };

  const isValid = name.trim() && subject.trim() && bodyHtml.trim();

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>
            Template Name <span className="text-error">*</span>
          </Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Welcome Email"
          />
        </div>
        <div className="space-y-1.5">
          <Label>
            Subject Line <span className="text-error">*</span>
          </Label>
          <Input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Welcome to Spark CRM!"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>
          <Tag className="h-3.5 w-3.5" />
          Tags
        </Label>
        <div
          className={cn(
            "flex flex-wrap items-center gap-1.5 min-h-9 px-3 py-1.5 rounded-md border border-input bg-transparent dark:bg-input/30 shadow-xs transition-[color,box-shadow] outline-none",
            "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          )}
        >
          {tags.map((tag) => (
            <span
              key={tag}
              className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${getTagColor({ tag })}`}
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:opacity-70 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            onBlur={addTag}
            placeholder={
              tags.length === 0
                ? "Type and press Enter to add tags…"
                : "Add more…"
            }
            className="flex-1 min-w-24 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Press Enter or Tab to add a tag
        </p>
      </div>

      <div className="space-y-1.5">
        <Label>
          Email Body <span className="text-error">*</span>
        </Label>
        <RichEditor
          editorRef={editorRef}
          placeholder="Write your email template content here…"
          defaultValue={initial?.bodyHtml}
          onChange={(html) => setBodyHtml(html)}
        />
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <Button
          variant="outline"
          type="button"
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button
          type="button"
          disabled={!isValid || isSaving}
          onClick={() => onSave({ name, subject, bodyHtml, tags })}
        >
          <Check className="h-4 w-4 mr-1.5" />
          {isSaving
            ? initial?._id
              ? "Saving…"
              : "Creating…"
            : initial?._id
              ? "Save Changes"
              : "Create Template"}
        </Button>
      </div>
    </div>
  );
};
