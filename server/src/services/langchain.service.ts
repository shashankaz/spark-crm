import { ChatGoogle } from "@langchain/google";
import { TavilySearch } from "@langchain/tavily";
import {
  HumanMessage,
  AIMessage,
  ToolMessage,
  SystemMessage,
  BaseMessage,
} from "@langchain/core/messages";
import {
  LeadResearchResult,
  leadResearchSchema,
} from "../types/services/langchain.service.type";

const model = new ChatGoogle({
  model: "gemini-flash-latest",
  temperature: 0.7,
});

const searchTool = new TavilySearch({
  maxResults: 10,
  topic: "general",
  includeRawContent: true,
  searchDepth: "advanced",
});

const modelWithTools = model.bindTools([searchTool]);

export const researchLead = async (
  query: string,
): Promise<LeadResearchResult> => {
  const messages: BaseMessage[] = [
    new SystemMessage(
      `You are an expert CRM lead-research agent.
Your goal is to gather comprehensive, accurate information about a person or company so a sales team can create a complete lead profile.

Use the Tavily search tool to:
1. Search for the person or company by name and any other identifying details provided.
2. Find verifiable contact details - email address and phone/mobile number.
3. Identify their organisation, job title, and professional background.
4. Discover their online presence (LinkedIn, company website, social media, news articles).
5. Run additional searches with refined queries if initial results are insufficient.

Read the raw page content returned by Tavily carefully - it often contains contact information, bios, and company details that are not in the snippet.`,
    ),
    new HumanMessage(
      `Research the following lead and gather all available information:

"${query}"

Specifically find:
- Full name (first and last)
- Email address
- Phone / mobile number
- Company or organisation name
- Gender (infer from name or biographical context)
- The URL or platform where you found the most reliable information (to use as the lead source)
- Any other details that help assess the quality of this lead`,
    ),
  ];

  for (let i = 0; i < 5; i++) {
    const response = await modelWithTools.invoke(messages);
    messages.push(response as AIMessage);

    if (!response.tool_calls || response.tool_calls.length === 0) {
      break;
    }

    for (const toolCall of response.tool_calls) {
      const toolResult = await searchTool.invoke(toolCall);
      messages.push(
        new ToolMessage({
          content:
            typeof toolResult === "string"
              ? toolResult
              : JSON.stringify(toolResult),
          tool_call_id: toolCall.id!,
        }),
      );
    }
  }

  messages.push(
    new HumanMessage(
      `Based on all the research gathered above, extract and return a structured lead profile.

Guidelines:
- Use only information that was actually found; do not invent data.
- If a required field (email, mobile) was not found, use a clearly placeholder value such as "not-found@unknown.com" or "0000000000" so the caller knows to follow up.
- Score the lead 0-100: award points for each verified field (name, email, mobile, company, gender) and boost the score for richly verifiable, professional sources.
- Set status to "new" unless the research content clearly indicates otherwise.
- Write a concise summary (2-4 sentences) covering who this person is, their role, company, and the confidence level of the data.`,
    ),
  );

  const structuredModel = model.withStructuredOutput(leadResearchSchema, {
    includeRaw: false,
  });

  return structuredModel.invoke(messages) as Promise<LeadResearchResult>;
};
