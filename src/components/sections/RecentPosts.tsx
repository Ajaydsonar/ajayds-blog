// src/components/sections/RecentPosts.tsx
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";

const posts = [
	{
		slug: "how-i-built-a-saas-in-2-weeks",
		title: "How I built a SaaS in 2 weeks",
		date: "Mar 12, 2025",
		readTime: "5 min read",
	},
	{
		slug: "why-i-switched-to-tanstack-start",
		title: "Why I switched to TanStack Start",
		date: "Mar 5, 2025",
		readTime: "3 min read",
	},
];

export function RecentPosts() {
	return (
		<section className="page-wrap mt-14 mb-32">
			<div className="mb-6 flex items-center justify-between">
				<h2 className="display-title text-xl font-bold text-[var(--sea-ink)]">
					Recent Posts
				</h2>
				<Link
					to="/blog"
					className="text-xs font-semibold text-[var(--lagoon-deep)] no-underline hover:underline"
				>
					All posts →
				</Link>
			</div>

			<div className="flex flex-col divide-y divide-[var(--line)]">
				{posts.map((post, i) => (
					<motion.div
						key={post.slug}
						initial={{ opacity: 0, y: 8 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-20px" }}
						transition={{
							duration: 0.35,
							delay: i * 0.05,
							ease: [0.16, 1, 0.3, 1],
						}}
					>
						<Link
							to="/blog/$slug"
							params={{ slug: post.slug }}
							className="group flex items-center justify-between gap-4 py-4 no-underline"
						>
							<div>
								<h3 className="text-sm font-semibold text-[var(--sea-ink)] group-hover:text-[var(--lagoon-deep)] transition-colors">
									{post.title}
								</h3>
								<p className="mt-0.5 text-xs text-[var(--sea-ink-soft)]">
									{post.date} · {post.readTime}
								</p>
							</div>
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="shrink-0 text-[var(--sea-ink-soft)] group-hover:text-[var(--lagoon-deep)] transition-colors"
								aria-hidden="true"
							>
								<path d="M5 12h14M12 5l7 7-7 7" />
							</svg>
						</Link>
					</motion.div>
				))}
			</div>
		</section>
	);
}
