import { createFileRoute } from "@tanstack/react-router";

import { PortableArticle } from "#/components/sanity/PortableArticle";
import { getPostBySlug } from "#/lib/sanity/posts.action.ts";

const siteUrl = (process.env.SITE_URL ?? "http://localhost:3000").replace(
	/\/$/,
	"",
);

const siteName = process.env.SITE_NAME ?? "Your Site Name";

function cleanMeta(value: string | null | undefined, fallback = "") {
	return value ?? fallback;
}

export const Route = createFileRoute("/blog/$slug")({
	loader: async ({ params }) => {
		return getPostBySlug({ data: { slug: params.slug } });
	},

	head: ({ loaderData }) => {
		const post = loaderData;

		if (!post) {
			return {
				meta: [
					{ title: `Post not found | ${siteName}` },
					{ name: "robots", content: "noindex,nofollow" },
				],
			};
		}

		const slug = cleanMeta(post.slug);
		const canonical = `${siteUrl}/blog/${slug}`;

		const title = cleanMeta(post.seoTitle || post.title, "Blog post");
		const description = cleanMeta(
			post.description || post.excerpt,
			"Read this blog post.",
		);

		const ogImage = post.coverImage?.url ?? `${siteUrl}/og-default.jpg`;

		const publishedAt = cleanMeta(post.publishedAt);
		const modifiedAt = cleanMeta(
			post.modifiedAt || post._updatedAt || post.publishedAt,
		);

		const jsonLd = {
			"@context": "https://schema.org",
			"@type": "BlogPosting",
			mainEntityOfPage: canonical,
			headline: title,
			description,
			image: [ogImage],
			datePublished: publishedAt,
			dateModified: modifiedAt,
			author: {
				"@type": "Person",
				name: post.author?.name ?? siteName,
			},
			publisher: {
				"@type": "Organization",
				name: siteName,
				logo: {
					"@type": "ImageObject",
					url: `${siteUrl}/logo.png`,
				},
			},
		};

		return {
			meta: [
				{ title: `${title} | ${siteName}` },
				{ name: "description", content: description },
				{
					name: "robots",
					content: "index,follow,max-image-preview:large",
				},

				{ property: "og:title", content: title },
				{ property: "og:description", content: description },
				{ property: "og:type", content: "article" },
				{ property: "og:url", content: canonical },
				{ property: "og:image", content: ogImage },
				{ property: "og:site_name", content: siteName },

				{ name: "twitter:card", content: "summary_large_image" },
				{ name: "twitter:title", content: title },
				{ name: "twitter:description", content: description },
				{ name: "twitter:image", content: ogImage },

				...(publishedAt
					? [{ property: "article:published_time", content: publishedAt }]
					: []),

				...(modifiedAt
					? [{ property: "article:modified_time", content: modifiedAt }]
					: []),

				...(post.author?.name
					? [{ property: "article:author", content: post.author.name }]
					: []),
			],
			links: [
				{
					rel: "canonical",
					href: canonical,
				},
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
	notFoundComponent: () => <div>Not found!</div>,
});

function BlogPostPage() {
	const post = Route.useLoaderData();

	if (!post) {
		return <main className="px-4 py-12">Post not found.</main>;
	}

	const heroImage = post.coverImage?.url ?? null;

	return (
		<main>
			<article>
				<header className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
					<div className="mb-6 flex flex-wrap gap-2">
						{post.categories?.map((category) => (
							<span
								key={category.slug ?? category.title}
								className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-700"
							>
								{category.title}
							</span>
						))}
					</div>

					<h1 className="text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl">
						{post.title ?? "Untitled post"}
					</h1>

					{post.excerpt || post.description ? (
						<p className="mt-6 text-xl leading-8 text-zinc-600">
							{post.excerpt || post.description}
						</p>
					) : null}

					<div className="mt-8 flex items-center gap-4 text-sm text-zinc-500">
						{post.author?.name ? <span>{post.author.name}</span> : null}

						{post.author?.name && post.publishedAt ? (
							<span aria-hidden="true">•</span>
						) : null}

						{post.publishedAt ? (
							<time dateTime={post.publishedAt}>
								{new Date(post.publishedAt).toLocaleDateString("en-IN", {
									day: "numeric",
									month: "long",
									year: "numeric",
								})}
							</time>
						) : null}
					</div>
				</header>

				{heroImage ? (
					<figure className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
						<img
							src={heroImage}
							alt={post.coverImage?.alt ?? post.title ?? ""}
							width={post.coverImage?.dimensions?.width ?? 1600}
							height={post.coverImage?.dimensions?.height ?? 900}
							fetchPriority="high"
							className="aspect-video w-full rounded-3xl object-cover shadow-sm"
						/>

						{post.coverImage?.caption ? (
							<figcaption className="mt-3 text-center text-sm text-zinc-500">
								{post.coverImage.caption}
							</figcaption>
						) : null}
					</figure>
				) : null}

				<section className="px-4 py-12 sm:px-6 lg:px-8">
					{post.body ? <PortableArticle value={post.body} /> : null}
				</section>
			</article>
		</main>
	);
}
