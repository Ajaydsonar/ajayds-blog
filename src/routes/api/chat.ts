import { GoogleGenAI } from "@google/genai";
import { createFileRoute } from "@tanstack/react-router";
import { searchWebsiteKnowledge } from "#/lib/qdrant.server.ts";

export const Route = createFileRoute("/api/chat")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				const { message } = await request.json();

				if (!message || typeof message !== "string") {
					return Response.json({ error: "Invalid message" }, { status: 400 });
				}

				const results = await searchWebsiteKnowledge(message);
				const context = results.points
					.map((point, index) => {
						const payload = point.payload as {
							text?: string;
							section?: string;
							url?: string;
						};

						return `
Source ${index + 1}
Text: ${payload.text}
Section: ${payload.section}
URL: ${payload.url}
`;
					})
					.join("\n\n");
				const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
				const response = await ai.models.generateContent({
					model: "gemini-3-flash-preview",
					contents: `
You are Ajay's personal website assistant.

Answer only using the provided website context.
If the answer is not in the context, say you don't know based on the website.
Keep the answer helpful, concise, and friendly.
Mention relevant page URLs when useful.

Website context:
${context}

User question:
${message}
`,
				});

				return Response.json({
					answer: response.text,
					sources: results.points.map((point) => point.payload),
				});
			},
		},
	},
});
