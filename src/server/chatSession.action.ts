import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";

const loadChatHistoryFn = createServerFn({ method: "GET" }).handler(
	async () => {
		const chatID = getCookie("chat_id");

		if (!chatID) {
			return;
		}

		const chatHistory = await loadChatHistory(chatID);

		return chatHistory;
	},
);

const createChatSessionFn = createServerFn({ method: "POST" }).handler(
	async () => {
		const chatID = getCookie("chat_id");

		if (chatID) {
			return;
		}
		const chat_id = crypto.randomUUID();
		setCookie("chat_id", chat_id);
	},
);
