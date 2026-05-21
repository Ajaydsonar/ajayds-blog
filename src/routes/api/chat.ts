import { google } from "@ai-sdk/google";
import { createFileRoute } from "@tanstack/react-router";
import {
	convertToModelMessages,
	createIdGenerator,
	type InferUITools,
	stepCountIs,
	streamText,
	type ToolSet,
	tool,
	type UIDataTypes,
	type UIMessage,
	validateUIMessages,
} from "ai";
import Airtable from "airtable";
import { z } from "zod";
import { loadChatHistory, saveMessage } from "#/lib/chat-store.ts";
import { searchWebsiteKnowledge } from "#/lib/qdrant.server.ts";

const airTableBase = new Airtable({
	apiKey: process.env.AIRTABLE_ACCESS_TOKEN,
}).base(process.env.AIRTABLE_BASE_ID!);

const LEAD_INTENT = ["HOT", "WARM", "COLD"] as const;

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
	saveLead: tool({
		description:
			"Saves a qualified customer lead into Airtable and sends an instant Telegram alert.",
		inputSchema: z.object({
			name: z.string().describe("The full name of the lead"),
			email: z.email("Valid email address"),
			phone: z.string().describe("Contact phone number"),
			notes: z
				.string()
				.describe("Detailed summary of what services or projects they need"),
			intent: z
				.enum(LEAD_INTENT)
				.describe("Intent of the lead : HOT | COLD | WARM"),
		}),
		execute: async ({ email, name, intent, notes, phone }) => {
			try {
				await airTableBase(process.env.AIRTABLE_TABLE_NAME!).create([
					{
						fields: {
							Name: name,
							Email: email,
							Phone: phone,
							Notes: notes,
							Intent: intent,
						},
					},
				]);

				// 2. Format Telegram Markdown Message
				const telegramMessage =
					`🔥 *New AI Lead Captured!*\n\n` +
					`👤 *Name:* ${name}\n` +
					`📧 *Email:* ${email}\n` +
					`📞 *Phone:* ${phone}\n` +
					`📝 *Needs:* ${notes}`;

				// 3. Send Telegram Notification via Bot API
				const telegramUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

				await fetch(telegramUrl, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						chat_id: process.env.TELEGRAM_CHAT_ID,
						text: telegramMessage,
						parse_mode: "Markdown", // Enables bold formatting
					}),
				});

				return {
					success: true,
					message: "Lead recorded and business owner notified via Telegram.",
				};
			} catch (error: any) {
				console.error("Failed to log lead or send Telegram message:", error);
				return { success: false, message: "Failed to record lead." };
			}
		},
	}),
} satisfies ToolSet;

export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

export const Route = createFileRoute("/api/chat")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				const { message, id }: { message: ChatMessage; id: string } =
					await request.json();

				const previousMessages = await loadChatHistory(id);
				// Append new message to previousMessages messages
				const messages = [...(previousMessages ?? []), message];

				const validatedMessage = await validateUIMessages<ChatMessage>({
					messages,
					tools,
				});

				const results = streamText({
					model: google("gemini-3.1-flash-lite"),
					system: `
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
6. For serious leads, politely collect their **Name**, **Email**, **Phone with country code**, and a description of **what they want**.
7. As soon as you have these four pieces of information — **Name**, **Email**, **valid Phone with country code**, and **what they want** — immediately call the \`saveLead\` tool with:
   - **name**: The lead's full name.
   - **email**: The lead's valid email address.
   - **phone**: The normalized phone number (with country code).
   - **notes**: A detailed summary of what they wanted, their project needs, or services requested.
   - **intent**: The determined intent (HOT | WARM | COLD).
8. Determine the \`intent\` parameter based on:
   - **HOT**: High urgency, clear project scope, ready to start immediately, or explicitly eager to hire Ajay.
   - **WARM**: Interested, asking about pricing/services, exploring ideas/solutions, but not necessarily starting today.
   - **COLD**: Casual browsing, vague/unrelated questions, or low interest.
9. Before calling \`saveLead\`, normalize the phone number into this format: \`+<country code> <phone number>\`.
10. Do not call \`saveLead\` until the phone number includes a country code.
11. After calling \`saveLead\`, warmly confirm to the visitor that their info has been recorded and that Ajay has been notified. Give them direct links to follow up: [Email Ajay](mailto:ajay@ajayds.com) or [WhatsApp Ajay](https://wa.me/918788221865).

## Phone Number Handling
- Always collect the visitor’s phone number with a **country code**.
- Correct format examples:
  - India: **+91 8788221865**
  - USA: **+1 4155552671**
  - UK: **+44 7123456789**
- If the visitor gives a phone number without a country code, ask for their country or ask them to resend the number with country code.
- If the visitor provides their country name, infer the country code and format the phone number properly.
  - Example: If the visitor says they are from India and gives \`8788221865\`, store it as \`+91 8788221865\`.
- If the country is unclear, do **not** guess. Ask one short follow-up question.
- Do not call \`saveLead\` until the phone number includes a country code.

## Lead Handling
- Be proactive but friendly.
- If a visitor is interested in working with Ajay or building something, ask conversational, warm questions to get their **Name**, **Email**, **Phone with country code**, and project description.
- Example: "I'd love to help you get in touch with Ajay! Could you share your name, email, phone number with country code, and a brief description of what you want to build?"
- Once you have the required info, call \`saveLead\` in the background and confirm to the visitor that they are all set and Ajay will reach out..`,
					messages: await convertToModelMessages(validatedMessage),
					tools,
					stopWhen: stepCountIs(5),

					onStepFinish({
						stepNumber,
						text,
						toolCalls,
						toolResults,
						finishReason,
						usage,
					}) {
						console.log("--- STEP FINISHED ---");
						console.log({
							stepNumber,
							text,
							finishReason,
							usage,
						});

						toolCalls.map((call) => {
							console.log(call.toolName);
							console.log(call.input);
							return {};
						});
						toolResults.map((result) => {
							console.log(result.toolName);
							console.log(result.output);
							return {};
						});
					},
				});

				return results.toUIMessageStreamResponse({
					originalMessages: messages,
					generateMessageId: createIdGenerator({
						prefix: "msg",
						separator: "-",
						size: 16,
					}),
					onFinish: async ({ messages }) => {
						try {
							await saveMessage(id, messages as ChatMessage[]);
						} catch (error) {
							console.error("error saving chat history:", error);
						}
					},
				});
			},
		},
	},
});
