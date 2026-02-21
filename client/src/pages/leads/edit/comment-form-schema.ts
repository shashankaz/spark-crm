import { z } from "zod";

export const commentFormSchema = z.object({
  comment: z.string("Please enter a comment").min(1, "Comment cannot be empty"),
});

export type CommentFormValues = z.infer<typeof commentFormSchema>;
