import { z } from "zod";

export const workflowFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  active: z.boolean().optional(),
  entity: z.enum(["lead", "deal", "organization"]),
  event: z.string(),
  actions: z.array(z.string()).refine((data) => data.length === 1, {
    message: "Exactly one action is required per workflow",
    path: ["actions"],
  }),
  actionConfigs: z.record(z.string(), z.any()),
});

export type WorkflowFormValues = z.infer<typeof workflowFormSchema>;
