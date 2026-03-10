import { z } from "zod";

export const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  dueDate: z.date().optional(),
  reminderAt: z.date().optional(),
  labelInput: z.string().optional(),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;
