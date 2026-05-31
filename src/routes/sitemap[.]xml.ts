// src/routes/sitemap[.]xml.ts

import { createFileRoute } from "@tanstack/react-router";
import { getPosts } from "#/lib/sanity/posts.action.ts";
import { absoluteUrl } from "#/lib/seo";

const staticRoutes = [
	{ path: "/", changefreq: "weekly", priority: "1.0" },
	{ path: "/portfolio", changefreq: "weekly", priority: "0.8" },
	{ path: "/blog", changefreq: "daily", priority: "0.9" },
	{ path: "/services", changefreq: "monthly", priority: "0.6" },
];
function escapeXml(value: string) {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&apos;");
}

export const Route = createFileRoute("/sitemap.xml")({
	server: {
		handlers: {
			GET: async () => {
				const posts = await getPosts();

				const urls = [
					...staticRoutes.map((path) => ({
						loc: absoluteUrl(path.path),
						lastmod: null,
						changefreq: path.changefreq,
						priority: path.priority,
					})),

					...posts
						.filter((post) => Boolean(post.slug))
						.map((post) => ({
							loc: absoluteUrl(`/blog/${post.slug}`),
							lastmod: post._updatedAt || post.publishedAt || null,
							changefreq: "daily",
							priority: "0.8",
						})),
				];

				const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
	.map(
		(url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    ${url.lastmod ? `<lastmod>${escapeXml(url.lastmod)}</lastmod>` : ""}
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
	)
	.join("\n")}
</urlset>`;

				return new Response(xml, {
					headers: {
						"Content-Type": "application/xml; charset=utf-8",
						"Cache-Control":
							"public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
					},
				});
			},
		},
	},
});
