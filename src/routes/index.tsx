// src/routes/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChatWidget } from "#/components/chatbot/ChatWidget.tsx";
import { loadChatsFn } from "#/server/chatSession.action.ts";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { HeroBanner } from "@/components/sections/HeroBanner";
import { HeroCTA } from "@/components/sections/HeroCTA";
import { RecentPosts } from "@/components/sections/RecentPosts";
import { ContactCTA } from "@/components/shared/ContactCTA";
import type { ChatMessage } from "./api/chat";

export const Route = createFileRoute("/")({
	loader: async () => {
		const { chatHistory, chat_id } = await loadChatsFn();
		return { id: chat_id, initialMessages: chatHistory as ChatMessage[] };
	},
	component: HomePage,
});

function HomePage() {
	const { id, initialMessages } = Route.useLoaderData();
	// Keep track of which slide is active at the top level
	const [activeServiceIndex, setActiveServiceIndex] = useState(0);

	return (
		<div>
			<HeroBanner current={activeServiceIndex} />
			<div className="mx-4 md:mx-auto md:w-4/5">
				<HeroCTA onSlideChange={(index) => setActiveServiceIndex(index)} />
				<FeaturedProjects />
				<RecentPosts />
				<ContactCTA
					heading="Let's build something great."
					subtext="Whether it's an MVP, an automation, or a data pipeline, I can help you ship it."
				/>
				<ChatWidget
					id={id ?? undefined}
					initialMessages={initialMessages ?? []}
				/>
			</div>
		</div>
	);
}
