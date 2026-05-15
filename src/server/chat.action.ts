import { GoogleGenAI } from "@google/genai";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { chatBotSystemInstruction } from "#/lib/prompts/chatbot.ts";
import { searchWebsiteKnowledge } from "#/lib/qdrant.server.ts";

interface SourcePayload {
	text?: string;
	section?: string;
	url?: string;
}

const chatSchema = z.object({
	message: z.string(),
});

export const chatMessage = createServerFn({ method: "POST" })
	.inputValidator(chatSchema)
	.handler(async ({ data }) => {
		const { message } = data;

		const results = await searchWebsiteKnowledge(message);

		const context = results.points
			.map((point, index) => {
				const payload = point.payload as SourcePayload;

				return `
Source ${index + 1}
Text: ${payload.text || ""}
Section: ${payload.section || "Unknown"}
URL: ${payload.url || "Not Provided"}
`;
			})
			.join("\n\n");

		const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

		const response = await ai.models.generateContent({
			model: "gemini-3.1-flash-lite",
			config: { systemInstruction: chatBotSystemInstruction },
			contents: `
Website context:
${context || "No relevant website context was retrieved for this question."}

User question:
${message}

Write the final answer for the website visitor.
`,
		});

		return {
			answer: response.text,
			sources: results.points.map((point) => point.payload as SourcePayload),
		};
	});
