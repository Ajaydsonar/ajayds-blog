import * as React from "react";
import { chatMessage } from "#/server/chat.action";
import { ChatInput } from "./ChatInput";
import { ChatMessage, type ChatMessageItem } from "./ChatMessage";
import type { SourcePayload } from "./SourceLinks";

interface ChatWidgetProps {
	className?: string;
	positionClassName?: string;
}

function createMessageId() {
	if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
		return crypto.randomUUID();
	}

	return Math.random().toString(36).slice(2);
}

export function ChatWidget({
	className = "",
	positionClassName = "fixed right-4 bottom-[calc(env(safe-area-inset-bottom)+6rem)] z-[60] sm:right-6 sm:bottom-6",
}: ChatWidgetProps) {
	const [isOpen, setIsOpen] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(false);

	const [messages, setMessages] = React.useState<ChatMessageItem[]>([
		{
			id: createMessageId(),
			role: "assistant",
			content:
				"Hey, I'm Ajay's AI assistant. Ask me about his work, projects, skills, or how to contact him.",
		},
	]);

	const messagesEndRef = React.useRef<HTMLDivElement | null>(null);

	React.useEffect(() => {
		if (!isOpen) return;

		messagesEndRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "end",
		});
	}, [isOpen]);

	React.useEffect(() => {
		function closeOnEscape(event: KeyboardEvent) {
			if (event.key === "Escape") setIsOpen(false);
		}

		window.addEventListener("keydown", closeOnEscape);
		return () => window.removeEventListener("keydown", closeOnEscape);
	}, []);

	async function sendMessage(content: string) {
		const userMessage: ChatMessageItem = {
			id: createMessageId(),
			role: "user",
			content,
		};

		setMessages((current) => [...current, userMessage]);
		setIsLoading(true);

		try {
			const response = await chatMessage({
				data: {
					message: content,
				},
			});

			setMessages((current) => [
				...current,
				{
					id: createMessageId(),
					role: "assistant",
					content:
						response.answer ||
						"I couldn't find a clear answer from the website yet.",
					sources: response.sources as SourcePayload[],
				},
			]);
		} catch {
			setMessages((current) => [
				...current,
				{
					id: createMessageId(),
					role: "assistant",
					content:
						"Something went wrong while answering that. Please try again.",
				},
			]);
		} finally {
			setIsLoading(false);
		}
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

						<div className="flex-1 space-y-3 overflow-y-auto px-3 py-4">
							{messages.map((message) => (
								<ChatMessage key={message.id} message={message} />
							))}

							{isLoading ? (
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

							<div ref={messagesEndRef} />
						</div>

						<ChatInput disabled={isLoading} onSend={sendMessage} />
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
