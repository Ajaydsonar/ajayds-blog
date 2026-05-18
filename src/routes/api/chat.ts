import { google } from "@ai-sdk/google";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { searchWebsiteKnowledge } from "#/lib/qdrant.server.ts";

export const Route = createFileRoute("/api/chat")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				const { messages }: { messages: UIMessage[] } = await request.json();

				// 2. Extract the latest user query
				const latestUserMessage = messages.findLast((m) => m.role === "user");

				const userQuery =
					latestUserMessage?.parts[0].type === "text"
						? latestUserMessage.parts[0].text
						: "";

				// 3. Fetch matching knowledge chunks from Qdrant
				let contextText = "";
				if (userQuery) {
					const searchResults = await searchWebsiteKnowledge(userQuery);
					// Assuming searchResults is an array of strings or objects containing text
					contextText = searchResults
						.map((chunk: any) => chunk.text || JSON.stringify(chunk))
						.join("\n\n");
				}

				const results = streamText({
					model: google("gemini-3.1-flash-lite"),
					system: `
You are AjayDS.com's official AI assistant.

VERIFIED_COMPANY_CONTEXT:
AjayDS is an AI development agency founded and run by Ajay Dhanraj Sonar. AjayDS builds AI SaaS products, AI features, workflow automations, AI agents, chatbots, data pipelines, web scraping systems, and lead scraping systems.
Primary contact: ajay@ajayds.com, WhatsApp/phone +91 8788221865.

RETRIEVED_CONTEXT:
${contextText}

INSTRUCTIONS:
- Answer only using VERIFIED_COMPANY_CONTEXT and RETRIEVED_CONTEXT.
- If the answer is missing, say: "I don’t have that exact detail yet, but Ajay can confirm it."
- Do not invent fixed prices, delivery timelines, case studies, clients, guarantees, or capabilities.
- For pricing questions, explain that pricing is project-based and depends on complexity.
- For service questions, briefly explain the relevant service and ask one useful qualifying question.
- For serious leads, collect name, contact info, project goal, budget range, and timeline.
- Keep the answer short, helpful, and professional.				
- Reply in Markdown so that mainly social links autorender with just handlename with link inbuilt href like in this format : [Link Text](https://www.example.com) 	
					`,
					messages: await convertToModelMessages(messages),
				});

				return results.toUIMessageStreamResponse();
			},
		},
	},
});
