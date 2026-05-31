import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────
   Syntax-highlighted code block
   Uses highlight.js loaded once at app level. If hljs isn't
   available it falls back to clean plain-text styling.
───────────────────────────────────────────────────────────── */

declare global {
	interface Window {
		hljs?: {
			highlightElement: (el: HTMLElement) => void;
			configure: (opts: Record<string, unknown>) => void;
		};
	}
}

function CodeBlock({
	code,
	language,
	filename,
}: {
	code: string;
	language?: string;
	filename?: string;
}) {
	const codeRef = useRef<HTMLElement>(null);

	useEffect(() => {
		if (codeRef.current && window.hljs) {
			window.hljs.configure({ ignoreUnescapedHTML: true });
			window.hljs.highlightElement(codeRef.current);
		}
	}, []);

	const lang = language || "plaintext";

	return (
		<figure
			className="code-block not-prose my-8 overflow-hidden rounded-xl"
			aria-label={filename ? `Code: ${filename}` : "Code block"}
		>
			{/* Top bar */}
			<div
				className="flex items-center justify-between px-4 py-2.5"
				style={{
					background: "var(--code-bar-bg, #173a40)",
					borderBottom:
						"1px solid var(--code-bar-border, rgba(79,184,178,0.18))",
				}}
			>
				<div className="flex items-center gap-2">
					{/* Traffic-light dots */}
					<span
						className="h-2.5 w-2.5 rounded-full"
						style={{ background: "rgba(255,255,255,0.15)" }}
					/>
					<span
						className="h-2.5 w-2.5 rounded-full"
						style={{ background: "rgba(255,255,255,0.15)" }}
					/>
					<span
						className="h-2.5 w-2.5 rounded-full"
						style={{ background: "rgba(255,255,255,0.15)" }}
					/>
					{filename && (
						<span
							className="ml-2 text-xs font-medium"
							style={{ color: "rgba(215,236,232,0.7)" }}
						>
							{filename}
						</span>
					)}
				</div>
				<span
					className="rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
					style={{
						background: "rgba(79,184,178,0.15)",
						color: "#4fb8b2",
					}}
				>
					{lang}
				</span>
			</div>

			{/* Code area */}
			<div
				className="relative overflow-x-auto"
				style={{ background: "var(--code-bg, #0f1d22)" }}
			>
				<pre className="m-0 overflow-x-auto p-5 text-sm leading-6">
					<code
						ref={codeRef}
						className={lang !== "plaintext" ? `language-${lang}` : ""}
						style={{
							fontFamily:
								'"Geist Mono", "JetBrains Mono", "Fira Code", ui-monospace, monospace',
							fontSize: "0.85rem",
						}}
					>
						{code}
					</code>
				</pre>
			</div>
		</figure>
	);
}

/* ─────────────────────────────────────────────────────────────
   Portable Text components
───────────────────────────────────────────────────────────── */

const components: PortableTextComponents = {
	block: {
		h2: ({ children }) => (
			<h2
				className="mt-14 scroll-mt-24 font-['Fraunces'] text-3xl font-bold leading-tight tracking-tight"
				style={{ color: "var(--sea-ink)" }}
			>
				{children}
			</h2>
		),
		h3: ({ children }) => (
			<h3
				className="mt-10 scroll-mt-24 font-['Fraunces'] text-2xl font-semibold leading-tight tracking-tight"
				style={{ color: "var(--sea-ink)" }}
			>
				{children}
			</h3>
		),
		h4: ({ children }) => (
			<h4
				className="mt-8 scroll-mt-24 text-xl font-semibold tracking-tight"
				style={{ color: "var(--sea-ink)" }}
			>
				{children}
			</h4>
		),
		normal: ({ children }) => (
			<p
				className="mt-6 text-[1.05rem] leading-[1.85]"
				style={{ color: "var(--sea-ink-soft)" }}
			>
				{children}
			</p>
		),
		blockquote: ({ children }) => (
			<blockquote
				className="relative my-10 pl-6 text-xl font-medium italic leading-8"
				style={{
					borderLeft: "3px solid var(--lagoon)",
					color: "var(--sea-ink)",
				}}
			>
				<span
					className="absolute -top-2 left-0 font-['Fraunces'] text-5xl leading-none"
					style={{ color: "var(--lagoon)", opacity: 0.4 }}
					aria-hidden="true"
				>
					"
				</span>
				{children}
			</blockquote>
		),
	},

	list: {
		bullet: ({ children }) => (
			<ul
				className="mt-6 space-y-2.5 pl-5 text-[1.05rem] leading-[1.85]"
				style={{ color: "var(--sea-ink-soft)", listStyleType: "none" }}
			>
				{children}
			</ul>
		),
		number: ({ children }) => (
			<ol
				className="mt-6 list-decimal space-y-2.5 pl-5 text-[1.05rem] leading-[1.85]"
				style={{ color: "var(--sea-ink-soft)" }}
			>
				{children}
			</ol>
		),
	},

	listItem: {
		bullet: ({ children }) => (
			<li className="relative flex items-start gap-2.5">
				<span
					className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full"
					style={{ background: "var(--lagoon)" }}
					aria-hidden="true"
				/>
				<span>{children}</span>
			</li>
		),
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
					className="font-medium underline underline-offset-4 transition-colors duration-150"
					style={{
						color: "var(--lagoon-deep)",
						textDecorationColor: "var(--lagoon)",
					}}
				>
					{children}
				</a>
			);
		},
		strong: ({ children }) => (
			<strong className="font-semibold" style={{ color: "var(--sea-ink)" }}>
				{children}
			</strong>
		),
		em: ({ children }) => (
			<em className="italic" style={{ color: "var(--sea-ink)" }}>
				{children}
			</em>
		),
		code: ({ children }) => (
			<code
				className="rounded-md px-1.5 py-0.5 font-mono text-[0.85em] font-medium"
				style={{
					background: "var(--inline-code-bg, rgba(79,184,178,0.12))",
					border: "1px solid var(--inline-code-border, rgba(79,184,178,0.22))",
					color: "var(--lagoon-deep)",
					fontFamily:
						'"Geist Mono", "JetBrains Mono", "Fira Code", ui-monospace, monospace',
				}}
			>
				{children}
			</code>
		),
	},

	types: {
		/* ── Sanity code block (e.g. via @sanity/code-input) ── */
		code: ({ value }) => {
			if (!value?.code) return null;
			return (
				<CodeBlock
					code={value.code}
					language={value.language}
					filename={value.filename}
				/>
			);
		},

		/* ── Inline images ────────────────────────────────── */
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
						decoding="async"
						className="w-full rounded-2xl object-cover"
						style={{ boxShadow: "0 2px 20px 0 rgba(23,58,64,0.08)" }}
					/>
					{value.caption && (
						<figcaption
							className="mt-3 text-center text-xs"
							style={{ color: "var(--sea-ink-soft)" }}
						>
							{value.caption}
						</figcaption>
					)}
				</figure>
			);
		},

		/* ── Callout / aside block ────────────────────────── */
		callout: ({ value }) => {
			const icons: Record<string, string> = {
				info: "ℹ",
				warning: "⚠",
				tip: "✦",
				danger: "✕",
			};
			const tone = value?.tone || "info";
			const icon = icons[tone] ?? "ℹ";

			return (
				<aside
					className="my-8 flex gap-4 rounded-xl p-5"
					style={{
						background: "var(--callout-bg, rgba(79,184,178,0.08))",
						border: "1px solid var(--callout-border, rgba(79,184,178,0.22))",
					}}
				>
					<span
						className="mt-0.5 shrink-0 text-base"
						style={{ color: "var(--lagoon)" }}
						aria-hidden="true"
					>
						{icon}
					</span>
					<p
						className="text-sm leading-relaxed"
						style={{ color: "var(--sea-ink)" }}
					>
						{value?.text}
					</p>
				</aside>
			);
		},
	},
};

/* ─────────────────────────────────────────────────────────────
   Highlight.js loader — injected once per page
   Uses cdnjs so it loads even in strict CSP environments.
───────────────────────────────────────────────────────────── */
let hljsLoaded = false;

function useHighlightJs() {
	useEffect(() => {
		if (hljsLoaded || typeof window === "undefined" || window.hljs) return;
		hljsLoaded = true;

		// Load CSS theme
		const link = document.createElement("link");
		link.rel = "stylesheet";
		// Atom One Dark — beautiful and matches our dark code bg
		link.href =
			"https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css";
		document.head.appendChild(link);

		// Load core JS
		const script = document.createElement("script");
		script.src =
			"https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js";
		script.async = true;
		script.onload = () => {
			// Load common language packs
			const langs = [
				"typescript",
				"javascript",
				"jsx",
				"tsx",
				"css",
				"bash",
				"json",
				"python",
				"rust",
				"go",
				"sql",
				"yaml",
				"markdown",
				"html",
				"xml",
			];
			langs.forEach((lang) => {
				const s = document.createElement("script");
				s.src = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/${lang}.min.js`;
				s.async = true;
				document.head.appendChild(s);
			});
		};
		document.head.appendChild(script);
	}, []);
}

/* ─────────────────────────────────────────────────────────────
   Public component
───────────────────────────────────────────────────────────── */
export function PortableArticle({ value }: { value: any[] }) {
	useHighlightJs();

	return (
		<>
			{/* Article-scoped CSS for code blocks + dark-mode overrides */}
			<style>{`
        /* Light theme overrides for hljs */
        :root:not([data-theme="dark"]) .hljs {
          background: transparent !important;
        }
        /* Dark code chrome — consistent across themes */
        .code-block { --code-bg: #0f1d22; --code-bar-bg: #132228; --code-bar-border: rgba(79,184,178,0.2); }
        /* Inline code */
        :root[data-theme="dark"] code:not([class*="language-"]),
        @media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) code:not([class*="language-"]) } {
          --inline-code-bg: rgba(79,184,178,0.14);
          --inline-code-border: rgba(79,184,178,0.28);
        }
        /* Dividers inside article */
        .portable-article hr {
          border: none;
          border-top: 1px solid var(--line);
          margin: 3rem 0;
        }
        /* Scroll-margin for headings when navigating via TOC */
        .portable-article h2, .portable-article h3, .portable-article h4 {
          scroll-margin-top: 5rem;
        }
        /* Selection colour */
        .portable-article ::selection {
          background: rgba(79,184,178,0.25);
        }
      `}</style>

			<div className="portable-article mx-auto max-w-3xl">
				<PortableText value={value} components={components} />
			</div>
		</>
	);
}
