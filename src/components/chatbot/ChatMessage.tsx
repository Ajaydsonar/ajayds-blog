import { SourceLinks, type SourcePayload } from "./SourceLinks";

export interface ChatMessageItem {
	id: string;
	role: "user" | "assistant";
	content: string;
	sources?: SourcePayload[];
}

interface ChatMessageProps {
	message: ChatMessageItem;
}

export function ChatMessage({ message }: ChatMessageProps) {
	const isUser = message.role === "user";

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
				<p className="whitespace-pre-wrap">{message.content}</p>

				{!isUser ? <SourceLinks sources={message.sources} /> : null}
			</div>
		</article>
	);
}
