import { z } from "zod";

export const leadResearchSchema = z.object({
  firstName: z.string().describe("First name of the lead"),
  lastName: z.string().optional().describe("Last name of the lead"),
  email: z.string().describe("Primary email address of the lead"),
  mobile: z.string().describe("Mobile / phone number of the lead"),
  gender: z
    .enum(["male", "female", "other"])
    .describe("Gender inferred from name or context"),
  orgName: z
    .string()
    .optional()
    .describe("Company or organisation the lead belongs to"),
  source: z
    .string()
    .optional()
    .describe("Source URL or platform where lead information was found"),
  score: z
    .number()
    .min(0)
    .max(100)
    .describe(
      "Lead quality score 0-100: higher score for more complete and verifiable data",
    ),
  status: z
    .enum(["new", "contacted", "qualified", "converted", "lost"])
    .describe("Current lead status - defaults to 'new' unless context differs"),
  summary: z
    .string()
    .describe("Concise summary of all research findings about this lead"),
});

export type LeadResearchResult = z.infer<typeof leadResearchSchema>;
