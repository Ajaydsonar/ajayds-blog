import * as React from "react";

interface ChatInputProps {
	disabled?: boolean;
	onSend: (message: string) => void | Promise<void>;
}

export function ChatInput({ disabled = false, onSend }: ChatInputProps) {
	const [value, setValue] = React.useState("");
	const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

	React.useEffect(() => {
		const textarea = textareaRef.current;
		if (!textarea) return;

		textarea.style.height = "0px";
		textarea.style.height = `${Math.min(textarea.scrollHeight, 112)}px`;
	}, []);

	function submitMessage() {
		const message = value.trim();

		if (!message || disabled) return;

		setValue("");
		void onSend(message);
	}

	return (
		<form
			className="border-t border-[var(--line)] bg-[var(--surface)] p-3"
			onSubmit={(event) => {
				event.preventDefault();
				submitMessage();
			}}
		>
			<div className="flex items-end gap-2">
				<textarea
					ref={textareaRef}
					value={value}
					rows={1}
					disabled={disabled}
					placeholder="Ask about my work..."
					onChange={(event) => setValue(event.target.value)}
					onKeyDown={(event) => {
						if (event.key === "Enter" && !event.shiftKey) {
							event.preventDefault();
							submitMessage();
						}
					}}
					className="no-scrollbar max-h-28 min-h-11 flex-1 resize-none rounded-2xl border border-[var(--line)] bg-[var(--chip-bg)] px-4 py-3 text-sm text-[var(--sea-ink)] outline-none placeholder:text-[var(--sea-ink-soft)]/70 transition focus:border-[var(--lagoon)] focus:ring-2 focus:ring-[var(--lagoon)]/20 disabled:cursor-not-allowed disabled:opacity-60"
				/>

				<button
					type="submit"
					disabled={disabled || !value.trim()}
					className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[var(--sea-ink)] text-[var(--foam)] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45"
					aria-label="Send message"
				>
					<svg
						width="17"
						height="17"
						viewBox="0 0 24 24"
						fill="none"
						aria-hidden="true"
					>
						<path
							d="M5 12h13M13 6l6 6-6 6"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</button>
			</div>
		</form>
	);
}
