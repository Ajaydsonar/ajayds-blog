// src/components/ChatWidget.tsx
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { AnimatePresence, motion } from "motion/react";
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

// ── New icons ────────────────────────────────────────────────────
function ChatIcon() {
	return (
		<svg
			width="22"
			height="22"
			viewBox="0 0 24 24"
			fill="none"
			aria-hidden="true"
		>
			<path
				d="M12 2C6.477 2 2 6.27 2 11.5c0 2.07.67 4 1.81 5.57L3 21l4.13-.77A10.2 10.2 0 0 0 12 21c5.523 0 10-4.27 10-9.5S17.523 2 12 2Z"
				stroke="currentColor"
				strokeWidth="1.65"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M8 10.5h4M8 13.5h6"
				stroke="currentColor"
				strokeWidth="1.65"
				strokeLinecap="round"
			/>
		</svg>
	);
}

function CloseIcon() {
	return (
		<svg
			width="17"
			height="17"
			viewBox="0 0 24 24"
			fill="none"
			aria-hidden="true"
		>
			<path
				d="M18 6L6 18M6 6l12 12"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
			/>
		</svg>
	);
}
// ────────────────────────────────────────────────────────────────

export function ChatWidget({
	className = "",
	positionClassName = "fixed right-4 bottom-[calc(env(safe-area-inset-bottom)+6rem)] z-[60] sm:right-6 sm:bottom-6",
	id,
	initialMessages,
}: ChatWidgetProps) {
	const [isOpen, setIsOpen] = React.useState(false);
	const [hovered, setHovered] = React.useState(false);

	const { messages, sendMessage, status, error } = useChat({
		messages: initialMessages,
		id,
		transport: new DefaultChatTransport({
			api: "/api/chat",
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
			messagesEndRef.current?.scrollIntoView({ block: "end" });
		});
		return () => cancelAnimationFrame(frame);
	}, [isOpen, visibleMessages, status]);

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
				{/* ── Chat panel (unchanged structure) ─────────────── */}
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
								{/* Small close in header stays simple — no animation needed here */}
								<svg
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									aria-hidden="true"
								>
									<path
										d="M18 6L6 18M6 6l12 12"
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

				{/* ── FAB button + tooltip ──────────────────────────── */}
				<div className="relative">
					{/* Tooltip — only when closed + hovered */}
					<AnimatePresence>
						{!isOpen && hovered && (
							<motion.div
								initial={{ opacity: 0, y: 6, scale: 0.94 }}
								animate={{ opacity: 1, y: 0, scale: 1 }}
								exit={{ opacity: 0, y: 6, scale: 0.94 }}
								transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
								className="pointer-events-none absolute bottom-[calc(100%+10px)] right-0 z-50"
							>
								<div className="whitespace-nowrap rounded-xl border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1.5 text-xs font-semibold text-[var(--sea-ink)] shadow-sm backdrop-blur-sm">
									Ask me anything
								</div>
								{/* Caret pointing down-right */}
								<div className="absolute -bottom-[5px] right-[18px] h-2.5 w-2.5 rotate-45 border-b border-r border-[var(--chip-line)] bg-[var(--chip-bg)]" />
							</motion.div>
						)}
					</AnimatePresence>

					{/* The FAB */}
					<motion.button
						type="button"
						onClick={() => setIsOpen((c) => !c)}
						onHoverStart={() => setHovered(true)}
						onHoverEnd={() => setHovered(false)}
						whileHover={{ scale: 1.06, y: -2 }}
						whileTap={{ scale: 0.93 }}
						transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
						className="grid size-13 place-items-center rounded-full border border-[var(--line)] bg-[var(--sea-ink)] text-[var(--foam)] shadow-[0_14px_40px_rgba(23,58,64,0.22)]"
						aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
						aria-expanded={isOpen}
					>
						{/* Icon swaps with counter-rotation */}
						<AnimatePresence mode="wait" initial={false}>
							{isOpen ? (
								<motion.span
									key="close"
									initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
									animate={{ rotate: 0, opacity: 1, scale: 1 }}
									exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
									transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
									className="flex items-center justify-center"
								>
									<CloseIcon />
								</motion.span>
							) : (
								<motion.span
									key="chat"
									initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
									animate={{ rotate: 0, opacity: 1, scale: 1 }}
									exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
									transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
									className="flex items-center justify-center"
								>
									<ChatIcon />
								</motion.span>
							)}
						</AnimatePresence>
					</motion.button>
				</div>
			</div>
		</div>
	);
}
