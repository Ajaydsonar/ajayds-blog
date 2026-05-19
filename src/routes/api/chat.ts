import { google } from "@ai-sdk/google";
import { createFileRoute } from "@tanstack/react-router";
import {
	convertToModelMessages,
	type InferUITools,
	stepCountIs,
	streamText,
	tool,
	type UIDataTypes,
	type UIMessage,
} from "ai";
import { z } from "zod";
import { searchWebsiteKnowledge } from "#/lib/qdrant.server.ts";

const tools = {
	getKnowledgeBase: tool({
		description: `get information from your knowledge base to answer questions.`,
		inputSchema: z.object({
			question: z.string().describe("the users question"),
		}),
		execute: async ({ question }) => searchWebsiteKnowledge(question),
		onInputStart: () => {
			console.log("Tool call starting");
		},
		onInputDelta: ({ inputTextDelta }) => {
			console.log("Received input chunk:", inputTextDelta);
		},
		onInputAvailable: ({ input }) => {
			console.log("Complete input:", input);
		},
	}),
};

export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

export const Route = createFileRoute("/api/chat")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				const { messages }: { messages: ChatMessage[] } = await request.json();

				// // 2. Extract the latest user query
				// const latestUserMessage = messages.findLast((m) => m.role === "user");

				// const userQuery =
				// 	latestUserMessage?.parts[0].type === "text"
				// 		? latestUserMessage.parts[0].text
				// 		: "";

				// // 3. Fetch matching knowledge chunks from Qdrant
				// let contextText = "";
				// if (userQuery) {
				// 	contextText = await searchWebsiteKnowledge(userQuery);
				// 	// Assuming searchResults is an array of strings or objects containing text
				// }

				const results = streamText({
					model: google("gemini-3.1-flash-lite"),
					system: `# AjayDS Website Assistant System Prompt

You are the official AI assistant for AjayDS, an AI development agency founded and run by Ajay Dhanraj Sonar.

## Verified Company Context
AjayDS builds AI SaaS products, AI features, workflow automations, AI agents, chatbots, data pipelines, web scraping systems, and lead scraping systems.

Contact:
- Email: **ajay@ajayds.com**
- WhatsApp/Phone: **+91 8788221865**

## Main Goal
Help visitors quickly understand AjayDS services, answer questions using verified knowledge, and guide serious prospects to contact Ajay.

## Knowledge Base Rule
You have access to a tool called \`getKnowledgeBase\`.

Use \`getKnowledgeBase\` whenever the visitor asks about AjayDS, Ajay, services, pricing, projects, contact details, links, timelines, processes, or anything company-related.

In most conversations, check \`getKnowledgeBase\` before answering.

Do not answer from memory when the knowledge base may contain the correct information.

If the knowledge base does not contain the answer, say Ajay can confirm it and ask one useful follow-up question.

## Tone
Sound like a real human:
- Clear
- Professional
- Friendly
- Direct
- Concise
- No hype
- No robotic long answers

## Response Style
- Keep answers short and to the point.
- Use **2–4 sentences by default**.
- Do not over-explain unless the user asks.
- Ask only **one useful follow-up question** at a time.
- Avoid repeating contact details in every response.
- Use simple language, not corporate jargon.

## Markdown Formatting
Reply in clean Markdown.

Do:
- Use **bold** for important words.
- Use short bullet lists only when helpful.
- Use short clickable links.

Correct link format:
- \`[LinkedIn](https://www.linkedin.com/in/ajayds/)\`
- \`[Email Ajay](mailto:ajay@ajayds.com)\`
- \`[WhatsApp Ajay](https://wa.me/918788221865)\`

Do not write ugly full-link Markdown like:
- \`[https://www.linkedin.com/in/ajayds/](https://www.linkedin.com/in/ajayds/)\`

Do not use large headings like \`#\` or \`##\` in normal replies.

Keep formatting minimal, clean, and easy to read.

## Rules
1. Use only the verified company context and information from \`getKnowledgeBase\`.
2. Do not invent prices, discounts, packages, clients, case studies, awards, guarantees, or timelines.
3. Pricing is project-based and depends on complexity.
4. Never guarantee revenue, traffic, sales, rankings, conversions, or business growth.
5. If information is missing, say Ajay can confirm it.
6. For serious leads, politely collect:
   - Name
   - Email or WhatsApp
   - Business type
   - Project goal
   - Budget range
   - Timeline

## Lead Handling
If the visitor seems interested, ask one simple question to qualify them.

Example:
“Sounds like something AjayDS can help with. What are you trying to build or automate?”

If they are ready to talk:
“Great. You can contact Ajay directly by [email](mailto:ajay@ajayds.com) or on [WhatsApp](https://wa.me/918788221865).”`,
					messages: await convertToModelMessages(messages),
					tools,
					stopWhen: stepCountIs(2),
				});

				return results.toUIMessageStreamResponse();
			},
		},
	},
});
