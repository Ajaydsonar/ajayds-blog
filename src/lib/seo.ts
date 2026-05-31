// src/lib/seo.ts
const rawSiteUrl = process.env.SITE_URL ?? "http://localhost:3000";

export const site = {
	name: "AjayDS",
	url: rawSiteUrl.replace(/\/$/, ""),
	defaultTitle: "Ajayds | AI Agency",
	defaultDescription:
		"Ajayds helps small businesses and founders automate operations with custom AI — from intelligent chatbots and data pipelines to web scraping and full AI SaaS products. Built to scale.",
	defaultOgImage: "/og-default.jpg",
	twitterHandle: "@ajaydsonarr",
};

export function absoluteUrl(path = "") {
	if (path.startsWith("http")) return path;

	const normalizedPath = path.startsWith("/") ? path : `/${path}`;
	return `${site.url}${normalizedPath}`;
}

export function cleanDescription(
	value: string | null | undefined,
	fallback = site.defaultDescription,
) {
	const text = value?.trim() || fallback;
	return text.length > 160 ? `${text.slice(0, 157).trim()}...` : text;
}

export function getOgImage(imageUrl: string | null | undefined) {
	if (!imageUrl) return absoluteUrl(site.defaultOgImage);

	if (imageUrl.startsWith("https://cdn.sanity.io")) {
		return `${imageUrl}?w=1200&h=630&fit=crop&auto=format&q=85`;
	}

	return absoluteUrl(imageUrl);
}

type SeoOptions = {
	title?: string | null;
	description?: string | null;
	path: string;
	image?: string | null;
	type?: "website" | "article";
	noIndex?: boolean;
};

export function seo({
	title,
	description,
	path,
	image,
	type = "website",
	noIndex = false,
}: SeoOptions) {
	const finalTitle = title ? `${title} | ${site.name}` : site.defaultTitle;
	const finalDescription = cleanDescription(description);
	const canonical = absoluteUrl(path);
	const ogImage = getOgImage(image);

	return {
		meta: [
			{ title: finalTitle },
			{ name: "description", content: finalDescription },
			{
				name: "robots",
				content: noIndex
					? "noindex,nofollow"
					: "index,follow,max-image-preview:large",
			},

			{ property: "og:title", content: finalTitle },
			{ property: "og:description", content: finalDescription },
			{ property: "og:type", content: type },
			{ property: "og:url", content: canonical },
			{ property: "og:image", content: ogImage },
			{ property: "og:site_name", content: site.name },

			{ name: "twitter:card", content: "summary_large_image" },
			{ name: "twitter:title", content: finalTitle },
			{ name: "twitter:description", content: finalDescription },
			{ name: "twitter:image", content: ogImage },
			{ name: "twitter:creator", content: site.twitterHandle },
		],
		links: [{ rel: "canonical", href: canonical }],
	};
}
