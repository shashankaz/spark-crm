import { z } from "zod";

export const groupFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export type GroupFormValues = z.infer<typeof groupFormSchema>;
