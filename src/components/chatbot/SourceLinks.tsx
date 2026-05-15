export interface SourcePayload {
	text?: string;
	section?: string;
	url?: string;
}

interface SourceLinksProps {
	sources?: SourcePayload[];
}

export function SourceLinks({ sources }: SourceLinksProps) {
	const visibleSources = sources
		?.filter((source) => source.section || source.url)
		.slice(0, 3);

	if (!visibleSources?.length) return null;

	return (
		<div className="mt-3 flex flex-wrap gap-1.5">
			{visibleSources.map((source, index) => {
				const label = source.section || source.url || `Source ${index + 1}`;
				const isExternal = source.url?.startsWith("http");

				if (!source.url) {
					return (
						<span
							// biome-ignore lint/suspicious/noArrayIndexKey: <ok>
							key={`${label}-${index}`}
							className="rounded-full border border-(--chip-line) bg-(--chip-bg) px-2.5 py-1 text-[11px] font-medium text-(--sea-ink-soft)"
						>
							{label}
						</span>
					);
				}

				return (
					<a
						// biome-ignore lint/suspicious/noArrayIndexKey: <ok>
						key={`${source.url}-${index}`}
						href={source.url}
						target={isExternal ? "_blank" : undefined}
						rel={isExternal ? "noreferrer" : undefined}
						className="rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-2.5 py-1 text-[11px] font-medium text-[var(--sea-ink-soft)] transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)]"
					>
						<span className="line-clamp-1">↗ {label}</span>
					</a>
				);
			})}
		</div>
	);
}
