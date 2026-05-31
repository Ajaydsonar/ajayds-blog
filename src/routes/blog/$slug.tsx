import { createFileRoute, Link } from "@tanstack/react-router";

import { PortableArticle } from "#/components/sanity/PortableArticle";
import { getPostBySlug } from "#/lib/sanity/posts.action.ts";
import { absoluteUrl, getOgImage, seo, site } from "#/lib/seo";

// const siteUrl = (process.env.SITE_URL ?? "http://localhost:3000").replace(
// 	/\/$/,
// 	"",
// );
// const siteName = process.env.SITE_NAME ?? "Your Site Name";

// function cleanMeta(value: string | null | undefined, fallback = "") {
// 	return value ?? fallback;
// }

export const Route = createFileRoute("/blog/$slug")({
	loader: async ({ params }) => {
		return getPostBySlug({ data: { slug: params.slug } });
	},

	head: ({ loaderData, params }) => {
		const post = loaderData;

		if (!post) {
			return seo({
				title: "Post not found",
				description: "This blog post could not be found.",
				path: `/blog/${params.slug}`,
				noIndex: true,
			});
		}

		const slug = post.slug || params.slug;

		const title = post.seoTitle || post.title || "Blog post";

		const description =
			post.description || post.excerpt || "Read this blog post by Ajay Sonar.";

		const image = post.coverImage?.url || site.defaultOgImage;

		const canonicalPath = `/blog/${slug}`;
		const canonicalUrl = absoluteUrl(canonicalPath);
		const ogImage = getOgImage(image);

		const publishedAt = post.publishedAt || undefined;
		const modifiedAt =
			post.modifiedAt || post._updatedAt || post.publishedAt || undefined;

		const baseSeo = seo({
			title,
			description,
			path: canonicalPath,
			image,
			type: "article",
		});

		const categoryMeta = (post.categories ?? [])
			.map((category) => category.title)
			.filter((title): title is string => Boolean(title))
			.map((title) => ({
				property: "article:section",
				content: title,
			}));

		const jsonLd = {
			"@context": "https://schema.org",
			"@type": "BlogPosting",
			mainEntityOfPage: {
				"@type": "WebPage",
				"@id": canonicalUrl,
			},
			headline: title,
			description,
			image: [ogImage],
			...(publishedAt ? { datePublished: publishedAt } : {}),
			...(modifiedAt ? { dateModified: modifiedAt } : {}),
			author: {
				"@type": "Person",
				name: post.author?.name || "Ajay Sonar",
			},
			publisher: {
				"@type": "Person",
				name: "Ajay Sonar",
			},
		};

		return {
			...baseSeo,
			meta: [
				...baseSeo.meta,

				...(publishedAt
					? [{ property: "article:published_time", content: publishedAt }]
					: []),

				...(modifiedAt
					? [{ property: "article:modified_time", content: modifiedAt }]
					: []),

				...(post.author?.name
					? [{ property: "article:author", content: post.author.name }]
					: []),

				...categoryMeta,
			],
			scripts: [
				{
					type: "application/ld+json",
					children: JSON.stringify(jsonLd),
				},
			],
		};
	},

	headers: () => ({
		"Cache-Control":
			"public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
	}),

	component: BlogPostPage,
});

function BlogPostPage() {
	const post = Route.useLoaderData();

	if (!post) {
		return (
			<main className="px-4 py-24 text-center">
				<p style={{ color: "var(--sea-ink-soft)" }}>Post not found.</p>
			</main>
		);
	}

	const heroImage = post.coverImage?.url ?? null;

	return (
		<main className="pb-24">
			<article>
				{/* ── Header ──────────────────────────────────────── */}
				<header className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
					{/* Back link */}
					<Link
						to="/blog"
						className="group mb-8 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider transition-colors duration-200"
						style={{ color: "var(--sea-ink-soft)" }}
					>
						<svg
							className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5"
							viewBox="0 0 16 16"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden="true"
						>
							<path d="M13 8H3M7 12l-4-4 4-4" />
						</svg>
						All posts
					</Link>

					{/* Categories */}
					{post.categories && post.categories.length > 0 && (
						<div className="mb-5 flex flex-wrap gap-2">
							{post.categories.map((category) => (
								<span
									key={category.slug ?? category.title}
									className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide"
									style={{
										background: "var(--chip-bg)",
										border: "1px solid var(--chip-line)",
										color: "var(--palm)",
									}}
								>
									{category.title}
								</span>
							))}
						</div>
					)}

					{/* Title */}
					<h1
						className="font-['Fraunces'] text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl"
						style={{ color: "var(--sea-ink)" }}
					>
						{post.title ?? "Untitled post"}
					</h1>

					{/* Excerpt / description */}
					{(post.excerpt || post.description) && (
						<p
							className="mt-5 text-lg leading-8"
							style={{ color: "var(--sea-ink-soft)" }}
						>
							{post.excerpt || post.description}
						</p>
					)}

					{/* Author + date row */}
					<div
						className="mt-8 flex items-center gap-3 text-sm"
						style={{ color: "var(--sea-ink-soft)" }}
					>
						{post.author?.name && (
							<>
								{/* Author avatar initials */}
								<span
									className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
									style={{
										background: "var(--hero-a)",
										color: "var(--lagoon-deep)",
									}}
								>
									{post.author.name
										.split(" ")
										.map((n: string) => n[0])
										.join("")
										.slice(0, 2)
										.toUpperCase()}
								</span>
								<span
									className="font-medium"
									style={{ color: "var(--sea-ink)" }}
								>
									{post.author.name}
								</span>
							</>
						)}

						{post.author?.name && post.publishedAt && (
							<span
								className="text-[1.2em]"
								style={{ color: "var(--line)" }}
								aria-hidden="true"
							>
								·
							</span>
						)}

						{post.publishedAt && (
							<time dateTime={post.publishedAt}>
								{new Date(post.publishedAt).toLocaleDateString("en-IN", {
									day: "numeric",
									month: "long",
									year: "numeric",
								})}
							</time>
						)}
					</div>
				</header>

				{/* ── Hero image — constrained to content width ─── */}
				{heroImage && (
					<figure className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
						<div className="overflow-hidden rounded-2xl shadow-sm">
							<img
								src={heroImage}
								alt={post.coverImage?.alt ?? post.title ?? ""}
								width={post.coverImage?.dimensions?.width ?? 1200}
								height={post.coverImage?.dimensions?.height ?? 675}
								fetchPriority="high"
								decoding="async"
								className="aspect-video w-full object-cover"
							/>
						</div>
						{post.coverImage?.caption && (
							<figcaption
								className="mt-3 text-center text-xs"
								style={{ color: "var(--sea-ink-soft)" }}
							>
								{post.coverImage.caption}
							</figcaption>
						)}
					</figure>
				)}

				{/* ── Article body ─────────────────────────────── */}
				<section className="px-4 pt-12 sm:px-6 lg:px-8">
					{post.body ? <PortableArticle value={post.body} /> : null}
				</section>

				{/* ── Footer nav ───────────────────────────────── */}
				<div
					className="mx-auto mt-16 max-w-3xl border-t px-4 pt-8 sm:px-6 lg:px-8"
					style={{ borderColor: "var(--line)" }}
				>
					<Link
						to="/blog"
						className="group inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-200"
						style={{ color: "var(--lagoon)" }}
					>
						<svg
							className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
							viewBox="0 0 16 16"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden="true"
						>
							<path d="M13 8H3M7 12l-4-4 4-4" />
						</svg>
						Back to all posts
					</Link>
				</div>
			</article>
		</main>
	);
}
