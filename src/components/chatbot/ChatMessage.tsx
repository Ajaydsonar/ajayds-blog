import type { ChatStatus, UIMessage } from "ai";
import { Children } from "react";
import { Streamdown } from "streamdown";
import { hr } from "zod/locales";

interface ChatMessageProps {
	message: UIMessage;
	status: ChatStatus;
}

function getMessageText(message: UIMessage) {
	return message.parts
		.filter((part) => part.type === "text")
		.map((part) => part.text)
		.join("");
}

export function ChatMessage({ message, status }: ChatMessageProps) {
	if (message.role === "system") return null;

	const isUser = message.role === "user";
	const text = getMessageText(message);

	if (!text) return null;

	return (
		<article className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
			<div
				className={[
					"max-w-[86%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm",
					isUser
						? "rounded-br-md bg-[var(--sea-ink)] text-[var(--foam)]"
						: "rounded-bl-md border border-[var(--line)] bg-[var(--chip-bg)] text-[var(--sea-ink)]",
				].join(" ")}
			>
				<p className="whitespace-pre-wrap">
					<Streamdown
						animated
						isAnimating={status === "streaming"}
						components={{
							h1: ({ children }) => (
								<h1 className="text-4xl font-bold text-blue-600">{children}</h1>
							),

							h3: ({ children }) => (
								<h3 className="font-semibold py-1 text-xl">{children}</h3>
							),
							h4: ({ children }) => (
								<h4 className="text-md font-semibold text-red-300">
									{children}
								</h4>
							),
							p: ({ children }) => (
								<p className="text-md leading-relaxed">{children}</p>
							),
							hr: ({ children }) => <hr className="py-2" />,
						}}
					>
						{text}
					</Streamdown>
				</p>
			</div>
		</article>
	);
}
