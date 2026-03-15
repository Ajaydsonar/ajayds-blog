// src/routes/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { HeroBanner } from "@/components/sections/HeroBanner";
import { HeroCTA } from "@/components/sections/HeroCTA";
import { RecentPosts } from "@/components/sections/RecentPosts";

export const Route = createFileRoute("/")({
	component: HomePage,
});

function HomePage() {
	return (
		<div>
			<HeroBanner />
			<HeroCTA />
			<FeaturedProjects />
			<RecentPosts />
		</div>
	);
}
