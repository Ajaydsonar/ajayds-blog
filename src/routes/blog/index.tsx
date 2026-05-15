import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { chatMessage } from "#/server/chat.action.ts";

export const Route = createFileRoute("/blog/")({
	component: RouteComponent,
});

function RouteComponent() {
	const [content, setContent] = useState("");
	const [isAnswering, setIsAnswering] = useState(false);
	const outputdivRef = useRef<HTMLDivElement>(null);

	const handleAI = async () => {
		if (!content.trim()) return;
		setIsAnswering(true);
		setContent("");
		if (outputdivRef.current) {
			outputdivRef.current.textContent = "answering...";
		}

		// if (!response.ok) {
		// 	throw new Error(data.error || "Chat request failed");
		// }
		try {
			const data = await chatMessage({ data: { message: content } });

			if (outputdivRef.current) {
				outputdivRef.current.textContent = data.answer || "";
			}
			console.log("using server fn");
		} catch (error: any) {
			console.log("error : ", error.message);
		}

		setIsAnswering(false);
	};
	return (
		<div className="flex flex-col">
			<div className="w-100 h-100 my-4 mx-auto border" ref={outputdivRef}></div>
			<div className="mx-auto">
				<input
					value={content}
					onChange={(e) => setContent(e.target.value)}
					type="text"
					placeholder="enter query"
					className="outline-blue-300  px-2 py-1 "
				/>
				<button
					disabled={isAnswering || !content.trim()}
					onClick={handleAI}
					type="button"
					className="m-4 text-blue-500 px-2 py-1 border border-blue-300"
				>
					launch
				</button>
			</div>
		</div>
	);
}
