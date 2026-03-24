// src/routes/services/index.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ContactCTA } from "@/components/shared/ContactCTA";
import { services } from "@/data/services";

export const Route = createFileRoute("/services/")({
	component: ServicesPage,
});

const serviceIcons: Record<string, React.ReactNode> = {
	"ai-webapps-mvp": (
		<svg
			width="22"
			height="22"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<title>Webapp development</title>

			<rect width="20" height="14" x="2" y="3" rx="2" />
			<path d="M8 21h8M12 17v4" />
		</svg>
	),
	"ai-data-pipelines": (
		<svg
			width="22"
			height="22"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<title>Backen development</title>

			<polyline points="16 18 22 12 16 6" />
			<polyline points="8 6 2 12 8 18" />
		</svg>
	),
	"ai-workflow-automation": (
		<svg
			width="22"
			height="22"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<title>python automation</title>
			<path d="M12 20h9" />
			<path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
		</svg>
	),
};

function ServicesPage() {
	return (
		<div>
			<div className="mx-6 md:mx-auto md:w-3/5">
				{/* Header */}
				<div className="page-wrap pt-16 pb-10">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
					>
						<p className="island-kicker mb-3">What I do</p>
						<h1 className="display-title text-3xl font-bold text-(--sea-ink) sm:text-4xl">
							Services
						</h1>
						<p className="mt-4 max-w-lg text-sm leading-relaxed text-(--sea-ink-soft) sm:text-base">
							I work with startups and businesses to build, ship, and automate.
							Fixed-scope projects. Clear timelines. Real results.
						</p>
					</motion.div>
				</div>

				{/* Service cards */}
				<div className="page-wrap flex flex-col gap-5">
					{services.map((service, i) => (
						<motion.div
							key={service.id}
							initial={{ opacity: 0, y: 24 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{
								duration: 0.5,
								delay: i * 0.1,
								ease: [0.22, 1, 0.36, 1],
							}}
						>
							<Link
								to="/services/$serviceId"
								params={{ serviceId: service.id }}
								className="group block no-underline"
							>
								<div className="feature-card island-shell rounded-2xl border border-[var(--line)] p-6 transition">
									<div className="flex items-start gap-4">
										{/* Icon */}
										<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--chip-line)] bg-[var(--chip-bg)] text-[var(--lagoon-deep)]">
											{serviceIcons[service.id]}
										</div>

										<div className="flex-1 min-w-0">
											<div className="flex items-start justify-between gap-4">
												<div>
													<h2 className="font-semibold text-[var(--sea-ink)] group-hover:text-[var(--lagoon-deep)] transition-colors">
														{service.title}
													</h2>
													<p className="mt-0.5 text-xs font-medium text-[var(--lagoon-deep)]">
														{service.tagline}
													</p>
												</div>
												<motion.div
													whileHover={{ x: 3 }}
													className="mt-0.5 shrink-0 text-(--sea-ink-soft) group-hover:text-(--lagoon-deep) transition-colors"
												>
													<svg
														width="18"
														height="18"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
													>
														<title>view service</title>
														<path d="M5 12h14M12 5l7 7-7 7" />
													</svg>
												</motion.div>
											</div>

											<p className="mt-2 text-sm leading-relaxed text-(--sea-ink-soft)">
												{service.description}
											</p>

											{/* Deliverables preview */}
											<div className="mt-4 flex flex-wrap gap-2">
												{service.deliverables.slice(0, 3).map((d) => (
													<span
														key={d}
														className="rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-2.5 py-0.5 text-xs font-medium text-[var(--sea-ink-soft)]"
													>
														{d}
													</span>
												))}
												{service.deliverables.length > 3 && (
													<span className="rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-2.5 py-0.5 text-xs font-medium text-[var(--lagoon-deep)]">
														+{service.deliverables.length - 3} more
													</span>
												)}
											</div>
										</div>
									</div>
								</div>
							</Link>
						</motion.div>
					))}
				</div>
			</div>

			<ContactCTA
				heading="Ready to start a project?"
				subtext="Tell me what you're building and I'll tell you how I can help."
			/>
		</div>
	);
}
