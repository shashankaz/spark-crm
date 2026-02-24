import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "react-router";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { SendHorizonal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

import { commentFormSchema } from "./comment-form-schema";
import type { CommentFormValues } from "./comment-form-schema";

import { useCreateComment } from "@/hooks/use-comment";

export const CommentCreateForm = () => {
  const { leadId } = useParams<{ leadId: string }>();

  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentFormSchema),
    mode: "onChange",
    defaultValues: {
      comment: "",
    },
  });

  const { mutate, isPending } = useCreateComment();

  const createComment = (data: CommentFormValues) => {
    mutate(
      {
        leadId: leadId!,
        comment: data.comment,
      },
      {
        onSuccess: ({ message }) => {
          toast.success(message);
        },
        onError: ({ message }) => {
          toast.error(message);
        },
        onSettled: () => {
          form.reset();
        },
      },
    );
  };

  return (
    <form
      id="comment-create-form"
      onSubmit={form.handleSubmit(createComment)}
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
              className="resize-none min-h-40"
            />
            {fieldState.invalid && (
              <FieldError
                className="text-error text-xs"
                errors={[fieldState.error]}
              />
            )}
          </Field>
        )}
      />
      <div className="flex justify-end">
        <Button
          type="submit"
          form="comment-create-form"
          size="sm"
          disabled={!form.formState.isValid || isPending}
        >
          <SendHorizonal className="h-4 w-4" />
          Post Comment
        </Button>
      </div>
    </form>
  );
};
