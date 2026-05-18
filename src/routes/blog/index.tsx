import { useChat } from "@ai-sdk/react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

// import { chatMessage } from "#/server/chat.action.ts";

export const Route = createFileRoute("/blog/")({
	component: Chat,
});

function Chat() {
	const [input, setInput] = useState("");
	const { messages, sendMessage } = useChat();

	return (
		<div className="flex flex-col w-full max-w-md py-24 mx-auto">
			{messages.map((message) => (
				<div key={message.id} className="whitespace-pre-wrap">
					{message.role === "user" ? "User: " : "AI: "}
					{/** biome-ignore lint/suspicious/useIterableCallbackReturn: <> */}
					{message.parts.map((part, i) => {
						switch (part.type) {
							case "text":
								return (
									// biome-ignore lint/suspicious/noArrayIndexKey: <>
									<div key={`${message.id}-${i}`}>{part.text}</div>
								);
						}
					})}
				</div>
			))}

			<form
				onSubmit={(e) => {
					e.preventDefault();
					sendMessage({ text: input });
					setInput("");

					window.scrollTo({
						top: document.body.scrollHeight,
						behavior: "smooth",
					});
				}}
			>
				<input
					className="fixed bg-zinc-100 dark:bg-zinc-900 bottom-20 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
					value={input}
					placeholder="Say something..."
					onChange={(e) => setInput(e.currentTarget.value)}
				/>
			</form>
		</div>
	);
}

// function RouteComponent() {
// 	const [content, setContent] = useState("");
// 	const [isAnswering, setIsAnswering] = useState(false);
// 	const outputdivRef = useRef<HTMLDivElement>(null);

// 	const handleAI = async () => {
// 		if (!content.trim()) return;
// 		setIsAnswering(true);
// 		setContent("");
// 		if (outputdivRef.current) {
// 			outputdivRef.current.textContent = "answering...";
// 		}

// 		// if (!response.ok) {
// 		// 	throw new Error(data.error || "Chat request failed");
// 		// }
// 		try {
// 			const data = await chatMessage({ data: { message: content } });

// 			if (outputdivRef.current) {
// 				outputdivRef.current.textContent = data.answer || "";
// 			}
// 			console.log("using server fn");
// 		} catch (error: any) {
// 			console.log("error : ", error.message);
// 		}

// 		setIsAnswering(false);
// 	};
// 	return (
// 		<div className="flex flex-col">
// 			<div className="w-100 h-100 my-4 mx-auto border" ref={outputdivRef}></div>
// 			<div className="mx-auto">
// 				<input
// 					value={content}
// 					onChange={(e) => setContent(e.target.value)}
// 					type="text"
// 					placeholder="enter query"
// 					className="outline-blue-300  px-2 py-1 "
// 				/>
// 				<button
// 					disabled={isAnswering || !content.trim()}
// 					onClick={handleAI}
// 					type="button"
// 					className="m-4 text-blue-500 px-2 py-1 border border-blue-300"
// 				>
// 					launch
// 				</button>
// 			</div>
// 		</div>
// 	);
// }
