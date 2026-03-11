import { z } from "zod";

export const campaignSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  bodyHtml: z.string().min(1, "Message is required"),
});

export type CampaignFormValues = z.infer<typeof campaignSchema>;
