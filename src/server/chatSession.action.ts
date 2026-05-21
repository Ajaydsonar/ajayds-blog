// src/server/chatSession.action.ts
import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import { generateId } from "ai";
import { loadChatHistory } from "#/lib/chat-store.ts";
import type { ChatMessage } from "#/routes/api/chat.ts";
// import type { ChatMessage } from "#/routes/api/chat.ts";

export const loadChatsFn = createServerFn({
	method: "GET",
	strict: false,
}).handler(async () => {
	const chatID = getCookie("chat_id") ?? null;

	if (!chatID) {
		const newId = generateId();

		setCookie("chat_id", newId, {
			path: "/",
			httpOnly: true, // Recommended for security
			maxAge: 60 * 60 * 24 * 7, // 1 week
		});

		return {
			chatHistory: [],
			chat_id: newId,
		};
	}

	try {
		const chatHistory = await loadChatHistory(chatID);

		return {
			chatHistory: Array.isArray(chatHistory)
				? (chatHistory as ChatMessage[])
				: [],
			chat_id: chatID,
		};
	} catch (error) {
		console.error("Failed to load chat session:", error);

		return {
			chatHistory: [],
			chat_id: chatID,
		};
	}
});
