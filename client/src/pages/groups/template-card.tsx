import DOMPurify from "dompurify";
import { formatDate } from "date-fns";
import { Edit2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { getTagColor } from "./get-tag-color";

import type { EmailTemplate } from "@/types/domain";

interface TemplateCardProps {
  template: EmailTemplate;
  onEdit: () => void;
  onDelete: () => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onEdit,
  onDelete,
}) => {
  const sanitizedHtml = DOMPurify.sanitize(template.bodyHtml);

  return (
    <div className="group relative flex flex-col border rounded-xl bg-card hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="h-1 w-full bg-linear-to-r from-primary/60 via-primary to-primary/40" />

      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">
              {template.name}
            </h3>
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {template.subject}
            </p>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={onEdit}
              title="Edit template"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-destructive hover:text-destructive"
              onClick={onDelete}
              title="Delete template"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <div
          className="text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-1"
          dangerouslySetInnerHTML={
            sanitizedHtml ? { __html: sanitizedHtml } : undefined
          }
        />
        {!sanitizedHtml && (
          <em className="text-sm text-muted-foreground">No content</em>
        )}

        {template.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {template.tags.map((tag) => (
              <span
                key={tag}
                className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full border ${getTagColor({ tag })}`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="border-t pt-2 mt-auto">
          <p className="text-xs text-muted-foreground">
            Updated {formatDate(template.updatedAt, "dd/MM/yyyy")}
          </p>
        </div>
      </div>
    </div>
  );
};
