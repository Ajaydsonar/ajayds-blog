// src/routes/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { HeroBanner } from "@/components/sections/HeroBanner";
import { HeroCTA } from "@/components/sections/HeroCTA";
import { RecentPosts } from "@/components/sections/RecentPosts";

export const Route = createFileRoute("/")({
	component: HomePage,
});

function HomePage() {
	// Keep track of which slide is active at the top level
	const [activeServiceIndex, setActiveServiceIndex] = useState(0);

	return (
		<div>
			<HeroBanner current={activeServiceIndex} />
			<div className="mx-4 md:mx-auto md:w-4/5">
				<HeroCTA onSlideChange={(index) => setActiveServiceIndex(index)} />
				<FeaturedProjects />
				<RecentPosts />
			</div>
		</div>
	);
}
