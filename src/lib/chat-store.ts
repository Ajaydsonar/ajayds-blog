import { redis } from "#/lib/db/index.ts";
import type { ChatMessage } from "#/routes/api/chat.ts";

export const loadChatHistory = async (chat_id: string) => {
	try {
		const chat_history = await redis.get<ChatMessage[]>(
			`chat:history:${chat_id}`,
		);
		return chat_history ?? [];
	} catch (error: any) {
		console.error("error loading chat history : ", error.message);
		return [];
	}
};

export const saveMessage = async (chat_id: string, content: ChatMessage[]) => {
	await redis.set(`chat:history:${chat_id}`, content);
};
