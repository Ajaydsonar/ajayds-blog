import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import * as React from "react";
import type { ChatMessage as ChatMessageType } from "#/routes/api/chat.ts";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";

interface ChatWidgetProps {
	className?: string;
	positionClassName?: string;
	id?: string;
	initialMessages?: ChatMessageType[];
}

const welcomeMessage: UIMessage = {
	id: "welcome-message",
	role: "assistant",
	parts: [
		{
			type: "text",
			text: "Hey, I'm Ajay's AI assistant. Ask me about his work, projects, skills, or how to contact him.",
		},
	],
};

function getMessageText(message?: UIMessage) {
	if (!message) return "";

	return message.parts
		.filter((part) => part.type === "text")
		.map((part) => part.text)
		.join("");
}

export function ChatWidget({
	className = "",
	positionClassName = "fixed right-4 bottom-[calc(env(safe-area-inset-bottom)+6rem)] z-[60] sm:right-6 sm:bottom-6",
	id,
	initialMessages,
}: ChatWidgetProps) {
	const [isOpen, setIsOpen] = React.useState(false);

	const { messages, sendMessage, status, error } = useChat({
		messages: initialMessages,
		id,
		transport: new DefaultChatTransport({
			api: "/api/chat",
			// only send the last message to the server:
			prepareSendMessagesRequest({ messages, id }) {
				return { body: { message: messages[messages.length - 1], id } };
			},
		}),
	});

	const messagesEndRef = React.useRef<HTMLDivElement | null>(null);

	const visibleMessages = React.useMemo(
		() => [welcomeMessage, ...messages],
		[messages],
	);

	const isSending = status === "submitted" || status === "streaming";

	const lastMessage = messages.at(-1);
	const isWaitingForFirstToken =
		status === "submitted" ||
		(status === "streaming" &&
			(!lastMessage ||
				lastMessage.role !== "assistant" ||
				!getMessageText(lastMessage).trim()));

	// biome-ignore lint/correctness/useExhaustiveDependencies: <I need it bro>
	React.useEffect(() => {
		if (!isOpen) return;

		const frame = requestAnimationFrame(() => {
			messagesEndRef.current?.scrollIntoView({
				block: "end",
			});
		});

		return () => cancelAnimationFrame(frame);
	}, [isOpen, visibleMessages, status]); //,

	React.useEffect(() => {
		function closeOnEscape(event: KeyboardEvent) {
			if (event.key === "Escape") setIsOpen(false);
		}

		window.addEventListener("keydown", closeOnEscape);
		return () => window.removeEventListener("keydown", closeOnEscape);
	}, []);

	async function handleSendMessage(content: string) {
		await sendMessage({ text: content });
	}

	return (
		<div className={`${positionClassName} ${className} pointer-events-none`}>
			<div className="relative pointer-events-auto">
				{isOpen ? (
					<section
						className="absolute bottom-16 right-0 flex h-[min(72vh,34rem)] w-[calc(100vw-2rem)] max-w-[23rem] flex-col overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--surface-strong)] text-[var(--sea-ink)] shadow-[0_24px_80px_rgba(23,58,64,0.18)] backdrop-blur-xl"
						aria-label="AI chatbot"
					>
						<header className="flex items-center justify-between border-b border-[var(--line)] bg-[linear-gradient(135deg,var(--surface-strong),var(--surface))] px-4 py-3">
							<div>
								<p className="text-sm font-bold text-[var(--sea-ink)]">
									Ask Ajay AI
								</p>
								<p className="text-xs text-[var(--sea-ink-soft)]">
									Website assistant
								</p>
							</div>

							<button
								type="button"
								onClick={() => setIsOpen(false)}
								className="grid size-8 place-items-center rounded-full border border-[var(--line)] bg-[var(--chip-bg)] text-[var(--sea-ink-soft)] transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)]"
								aria-label="Close chatbot"
							>
								<svg
									width="15"
									height="15"
									viewBox="0 0 24 24"
									fill="none"
									aria-hidden="true"
								>
									<path
										d="M6 6l12 12M18 6 6 18"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
									/>
								</svg>
							</button>
						</header>

						<div className="flex-1 space-y-3 overflow-y-auto px-3 py-4 no-scrollbar">
							{visibleMessages.map((message) => (
								<React.Fragment key={message.id}>
									{message.parts.map((part, index) => {
										switch (part.type) {
											case "text":
												return (
													<ChatMessage
														// biome-ignore lint/suspicious/noArrayIndexKey: <ok>
														key={`${message.id}-${index}`}
														message={message}
														status={status}
													/>
												);

											case "tool-getInformation":
												return (
													// biome-ignore lint/suspicious/noArrayIndexKey: <ok>
													<div key={`${message.id}-${index}`}>
														call
														{part.state === "output-available" ? "ed" : "ing"}{" "}
														tool: {part.type}
														<pre className="my-4 bg-zinc-100 p-2 rounded-sm">
															{JSON.stringify(part.input, null, 2)}
														</pre>
													</div>
												);

											default:
												return null;
										}
									})}
								</React.Fragment>
							))}

							{isWaitingForFirstToken ? (
								<div className="flex justify-start">
									<div className="rounded-2xl rounded-bl-md border border-[var(--line)] bg-[var(--chip-bg)] px-3.5 py-2.5 text-sm text-[var(--sea-ink-soft)]">
										<span className="inline-flex items-center gap-1">
											<span className="size-1.5 animate-pulse rounded-full bg-[var(--lagoon)]" />
											<span className="size-1.5 animate-pulse rounded-full bg-[var(--lagoon)] [animation-delay:120ms]" />
											<span className="size-1.5 animate-pulse rounded-full bg-[var(--lagoon)] [animation-delay:240ms]" />
										</span>
									</div>
								</div>
							) : null}

							{error ? (
								<div className="flex justify-start">
									<div className="rounded-2xl rounded-bl-md border border-[var(--line)] bg-[var(--chip-bg)] px-3.5 py-2.5 text-sm text-[var(--sea-ink-soft)]">
										Something went wrong while answering that. Please try again.
									</div>
								</div>
							) : null}

							<div ref={messagesEndRef} />
						</div>

						<ChatInput disabled={isSending} onSend={handleSendMessage} />
					</section>
				) : null}

				<button
					type="button"
					onClick={() => setIsOpen((current) => !current)}
					className="grid size-13 place-items-center rounded-full border border-[var(--line)] bg-[var(--sea-ink)] text-[var(--foam)] shadow-[0_14px_40px_rgba(23,58,64,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(23,58,64,0.28)]"
					aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
					aria-expanded={isOpen}
				>
					{isOpen ? (
						<svg
							width="19"
							height="19"
							viewBox="0 0 24 24"
							fill="none"
							aria-hidden="true"
						>
							<path
								d="M6 6l12 12M18 6 6 18"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
							/>
						</svg>
					) : (
						<svg
							width="21"
							height="21"
							viewBox="0 0 24 24"
							fill="none"
							aria-hidden="true"
						>
							<path
								d="M7.5 8.5h9M7.5 12h5.5M21 11.5a8.5 8.5 0 0 1-12.4 7.56L4 20l.94-4.3A8.5 8.5 0 1 1 21 11.5Z"
								stroke="currentColor"
								strokeWidth="1.9"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					)}
				</button>
			</div>
		</div>
	);
}
