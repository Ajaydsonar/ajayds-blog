import type { ChatStatus, UIMessage } from "ai";
import { Streamdown } from "streamdown";

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
				<div className="whitespace-pre-wrap">
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
								<p className="leading-relaxed">{children}</p>
							),
							hr: () => <hr className="py-2" />,
							a: ({ children, href, className }) => (
								<a
									href={href}
									target="_blank"
									className={`inline-flex items-center bg-[var(--lagoon)]/10 text-[var(--lagoon)] p-1 mx-1 rounded-3xl border border-[var(--lagoon)] text-xs ${className ?? ""}`}
								>
									{children}
								</a>
							),
						}}
					>
						{text}
					</Streamdown>
				</div>
			</div>
		</article>
	);
}
