import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { SendHorizonal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

import { commentFormSchema } from "./comment-form-schema";
import type { CommentFormValues } from "./comment-form-schema";

interface CommentCreateFormProps {
  onAdd: (data: CommentFormValues) => void;
}

export const CommentCreateForm: React.FC<CommentCreateFormProps> = ({
  onAdd,
}) => {
  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentFormSchema),
    mode: "onChange",
    defaultValues: {
      comment: "",
    },
  });

  const onSubmit = (data: CommentFormValues) => {
    try {
      onAdd(data);
    } catch (error) {
      console.error(error);
    } finally {
      form.reset();
    }
  };

  return (
    <form
      id="comment-create-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-2"
    >
      <Controller
        name="comment"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <Textarea
              {...field}
              id="comment"
              aria-invalid={fieldState.invalid}
              placeholder="Write a comment…"
              rows={3}
              className="resize-none"
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
      <div className="flex justify-end">
        <Button type="submit" form="comment-create-form" size="sm">
          <SendHorizonal className="h-4 w-4" />
          Post Comment
        </Button>
      </div>
    </form>
  );
};
