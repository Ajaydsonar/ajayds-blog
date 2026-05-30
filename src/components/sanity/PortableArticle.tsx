import { PortableText, type PortableTextComponents } from "@portabletext/react";

const components: PortableTextComponents = {
	block: {
		h2: ({ children }) => (
			<h2 className="mt-12 scroll-mt-24 text-3xl font-bold tracking-tight text-zinc-950">
				{children}
			</h2>
		),
		h3: ({ children }) => (
			<h3 className="mt-10 scroll-mt-24 text-2xl font-semibold tracking-tight text-zinc-950">
				{children}
			</h3>
		),
		normal: ({ children }) => (
			<p className="mt-6 text-lg leading-8 text-zinc-700">{children}</p>
		),
		blockquote: ({ children }) => (
			<blockquote className="mt-8 border-l-4 border-zinc-900 pl-6 text-xl font-medium italic leading-8 text-zinc-800">
				{children}
			</blockquote>
		),
	},
	list: {
		bullet: ({ children }) => (
			<ul className="mt-6 list-disc space-y-3 pl-6 text-lg leading-8 text-zinc-700">
				{children}
			</ul>
		),
		number: ({ children }) => (
			<ol className="mt-6 list-decimal space-y-3 pl-6 text-lg leading-8 text-zinc-700">
				{children}
			</ol>
		),
	},
	listItem: {
		bullet: ({ children }) => <li>{children}</li>,
		number: ({ children }) => <li>{children}</li>,
	},
	marks: {
		link: ({ value, children }) => {
			const href = value?.href || "#";
			const isExternal = href.startsWith("http");
			const openInNewTab = value?.openInNewTab ?? isExternal;

			return (
				<a
					href={href}
					target={openInNewTab ? "_blank" : undefined}
					rel={openInNewTab ? "noopener noreferrer" : undefined}
					className="font-medium text-zinc-950 underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-950"
				>
					{children}
				</a>
			);
		},
		code: ({ children }) => (
			<code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm font-medium text-zinc-900">
				{children}
			</code>
		),
	},
	types: {
		image: ({ value }) => {
			if (!value?.url) return null;

			return (
				<figure className="my-10">
					<img
						src={value.url}
						alt={value.alt || ""}
						width={value.dimensions?.width || 1200}
						height={value.dimensions?.height || 675}
						loading="lazy"
						className="w-full rounded-2xl object-cover shadow-sm"
					/>

					{value.caption ? (
						<figcaption className="mt-3 text-center text-sm text-zinc-500">
							{value.caption}
						</figcaption>
					) : null}
				</figure>
			);
		},
	},
};

export function PortableArticle({ value }: { value: any[] }) {
	return (
		<div className="mx-auto max-w-3xl">
			<PortableText value={value} components={components} />
		</div>
	);
}
