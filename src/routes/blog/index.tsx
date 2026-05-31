import { createFileRoute, Link } from "@tanstack/react-router";
import { getPosts } from "#/lib/sanity/posts.action.ts";
import { absoluteUrl, seo } from "#/lib/seo";

export const Route = createFileRoute("/blog/")({
	loader: async () => {
		return getPosts();
	},

	head: () => {
		const baseSeo = seo({
			title: "Blog",
			description:
				"Practical AI Powered Software Development and Automation tutorials, notes, and guides by Ajay Sonar.",
			path: "/blog",
			type: "website",
		});

		const jsonLd = {
			"@context": "https://schema.org",
			"@type": "Blog",
			name: "AjayDS Blog",
			description:
				"Practical AI Powered Software Development and Automation tutorials, notes, and guides by Ajay Sonar.",
			url: absoluteUrl("/blog"),
			publisher: {
				"@type": "Person",
				name: "Ajay Sonar",
			},
		};

		return {
			...baseSeo,
			scripts: [
				{
					type: "application/ld+json",
					children: JSON.stringify(jsonLd),
				},
			],
		};
	},

	component: BlogIndexPage,
});

function BlogIndexPage() {
	const posts = Route.useLoaderData();

	return (
		<main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
			{/* Header */}
			<header className="mb-16">
				<p
					className="mb-3 text-xs font-semibold uppercase tracking-[0.18em]"
					style={{ color: "var(--lagoon)" }}
				>
					Writing
				</p>
				<h1
					className="font-['Fraunces'] text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl"
					style={{ color: "var(--sea-ink)" }}
				>
					From Code to Impact
				</h1>
				<p
					className="mt-4 max-w-lg text-base leading-relaxed"
					style={{ color: "var(--sea-ink-soft)" }}
				>
					Cases, code, and ideas from building AI solutions for real businesses.
				</p>
			</header>

			{/* Posts grid */}
			{posts.length === 0 ? (
				<p style={{ color: "var(--sea-ink-soft)" }}>
					No posts yet — check back soon.
				</p>
			) : (
				<section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{posts.map((post) => {
						const imageUrl = post.coverImage?.url;
						return (
							<article
								key={post._id}
								className="group relative flex flex-col overflow-hidden rounded-2xl transition-transform duration-300 hover:-translate-y-1"
								style={{
									background: "var(--surface)",
									border: "1px solid var(--line)",
									backdropFilter: "blur(8px)",
								}}
							>
								<Link
									to="/blog/$slug"
									params={{ slug: post.slug || "" }}
									className="flex flex-1 flex-col"
								>
									{/* Cover image */}
									{imageUrl ? (
										<div className="relative overflow-hidden">
											<img
												src={imageUrl}
												alt={post.coverImage?.alt || post.title || ""}
												width={post.coverImage?.dimensions?.width || 800}
												height={post.coverImage?.dimensions?.height || 450}
												loading="lazy"
												decoding="async"
												className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
											/>
											{/* Subtle gradient overlay */}
											<div
												className="pointer-events-none absolute inset-0"
												style={{
													background:
														"linear-gradient(to top, rgba(0,0,0,0.15) 0%, transparent 50%)",
												}}
											/>
										</div>
									) : (
										/* Placeholder tile when no cover */
										<div
											className="flex aspect-video w-full items-center justify-center"
											style={{ background: "var(--hero-a)" }}
										>
											<span
												className="text-4xl font-['Fraunces'] font-bold opacity-20"
												style={{ color: "var(--lagoon)" }}
											>
												{post.title?.[0] ?? "✦"}
											</span>
										</div>
									)}

									{/* Card body */}
									<div className="flex flex-1 flex-col p-5">
										{/* Date */}
										<time
											dateTime={post.publishedAt || ""}
											className="text-xs font-medium"
											style={{ color: "var(--sea-ink-soft)" }}
										>
											{new Date(post.publishedAt || "").toLocaleDateString(
												"en-IN",
												{
													day: "numeric",
													month: "long",
													year: "numeric",
												},
											)}
										</time>

										{/* Title */}
										<h2
											className="mt-2 text-[1.05rem] font-semibold leading-snug tracking-tight"
											style={{ color: "var(--sea-ink)" }}
										>
											{post.title}
										</h2>

										{/* Excerpt */}
										{(post.excerpt || post.description) && (
											<p
												className="mt-2 line-clamp-2 text-sm leading-relaxed"
												style={{ color: "var(--sea-ink-soft)" }}
											>
												{post.excerpt || post.description}
											</p>
										)}

										{/* CTA */}
										<div className="mt-auto pt-4">
											<span
												className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider transition-colors duration-200"
												style={{ color: "var(--lagoon)" }}
											>
												Read
												<svg
													className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
													viewBox="0 0 16 16"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
													aria-hidden="true"
												>
													<path d="M3 8h10M9 4l4 4-4 4" />
												</svg>
											</span>
										</div>
									</div>
								</Link>
							</article>
						);
					})}
				</section>
			)}
		</main>
	);
}
