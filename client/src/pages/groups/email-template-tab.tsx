import { useState } from "react";
import { Plus, FileText, Search } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import { TemplateCard } from "./template-card";
import { TemplateForm } from "./email-templates";
import { getTagColor } from "./get-tag-color";

import {
  useEmailTemplates,
  useCreateEmailTemplate,
  useUpdateEmailTemplate,
  useDeleteEmailTemplate,
} from "@/hooks";

import type { IEmailTemplate } from "@/types/domain";
import type { CreateEmailTemplateRequest } from "@/types/services";

export const EmailTemplatesTab: React.FC = () => {
  const [createOpen, setCreateOpen] = useState(false);
  const [editTemplate, setEditTemplate] = useState<IEmailTemplate | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const { data, isPending } = useEmailTemplates({
    search,
    tag: activeTag ?? undefined,
  });
  const templates = data?.templates ?? [];

  const { mutate: create, isPending: isCreating } = useCreateEmailTemplate();
  const { mutate: update, isPending: isUpdating } = useUpdateEmailTemplate();
  const { mutate: remove, isPending: isDeleting } = useDeleteEmailTemplate();

  const handleCreate = (data: CreateEmailTemplateRequest) => {
    create(data, {
      onSuccess: () => setCreateOpen(false),
    });
  };

  const handleEdit = (data: CreateEmailTemplateRequest) => {
    if (!editTemplate) return;

    update(
      { id: editTemplate._id, ...data },
      {
        onSuccess: () => setEditTemplate(null),
      },
    );
  };

  const handleDelete = () => {
    if (!deleteId) return;

    remove(
      { id: deleteId },
      {
        onSuccess: () => setDeleteId(null),
      },
    );
  };

  const allTags = Array.from(new Set(templates.flatMap((t) => t.tags))).sort();

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates…"
            className="pl-9"
          />
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-1.5" />
          New Template
        </Button>
      </div>

      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTag(null)}
            className={`text-xs px-3 py-1 rounded-full border font-medium transition-colors ${
              activeTag === null
                ? "bg-foreground text-background border-foreground"
                : "bg-background text-muted-foreground border-border hover:border-foreground/50"
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`text-xs px-3 py-1 rounded-full border font-medium transition-colors ${
                activeTag === tag
                  ? `${getTagColor({ tag })} border-current`
                  : "bg-background text-muted-foreground border-border hover:border-foreground/50"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {isPending ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="font-medium text-foreground mb-1">
            {search || activeTag ? "No templates found" : "No templates yet"}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            {search || activeTag
              ? "Try adjusting your search or tag filter."
              : "Create reusable email templates to speed up campaigns."}
          </p>
          {!search && !activeTag && (
            <Button
              onClick={() => setCreateOpen(true)}
              variant="outline"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Create your first template
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {templates.map((template) => (
            <TemplateCard
              key={template._id}
              template={template}
              onEdit={() => setEditTemplate(template)}
              onDelete={() => setDeleteId(template._id)}
            />
          ))}
        </div>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Create Email Template</DialogTitle>
          </DialogHeader>
          <TemplateForm
            onSave={handleCreate}
            onCancel={() => setCreateOpen(false)}
            isSaving={isCreating}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editTemplate}
        onOpenChange={(o) => !o && setEditTemplate(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Template</DialogTitle>
          </DialogHeader>
          {editTemplate && (
            <TemplateForm
              initial={editTemplate}
              onSave={handleEdit}
              onCancel={() => setEditTemplate(null)}
              isSaving={isUpdating}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this template?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The template will be permanently
              removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
