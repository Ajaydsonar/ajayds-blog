// src/routes/portfolio/index.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { projects } from "@/data/c/projects";

export const Route = createFileRoute("/portfolio/")({
	component: PortfolioPage,
});

function PortfolioPage() {
	return (
		<div className="mx-6 md:mx-auto md:w-3/5">
			<div className="page-wrap pt-16 pb-10">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
				>
					<p className="island-kicker mb-3">My work</p>
					<h1 className="display-title text-3xl font-bold text-[var(--sea-ink)] sm:text-4xl">
						Portfolio
					</h1>
					<p className="mt-4 max-w-lg text-sm leading-relaxed text-[var(--sea-ink-soft)] sm:text-base">
						A selection of projects I've built for clients and myself. Each one
						links to the live product.
					</p>
				</motion.div>
			</div>

			<div className="page-wrap flex flex-col gap-6 mb-32">
				{projects.map((project, i) => (
					<motion.div
						key={project.id}
						initial={{ opacity: 0, y: 24 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.5,
							delay: i * 0.1,
							ease: [0.22, 1, 0.36, 1],
						}}
					>
						<Link
							to="/portfolio/$projectId"
							params={{ projectId: project.id }}
							className="group block no-underline"
						>
							<div className="feature-card island-shell overflow-hidden rounded-2xl border border-[var(--line)] transition">
								{/* Screenshot placeholder */}
								<div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-[var(--lagoon)] via-[var(--palm)] to-[var(--sea-ink)] opacity-70 sm:h-56">
									{project.screenshots[0] && (
										<img
											src={project.screenshots[0]}
											alt={project.title}
											className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
											onError={(e) => {
												e.currentTarget.style.display = "none";
											}}
										/>
									)}
									{/* Live URL badge */}
									<div className="absolute bottom-3 right-3">
										<span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
											<span className="h-1.5 w-1.5 rounded-full bg-[#25D366]" />
											Live
										</span>
									</div>
								</div>

								{/* Content */}
								<div className="p-6">
									<div className="flex items-start justify-between gap-4">
										<div>
											<h2 className="font-semibold text-[var(--sea-ink)] group-hover:text-[var(--lagoon-deep)] transition-colors">
												{project.title}
											</h2>
											<p className="mt-1 text-sm text-[var(--sea-ink-soft)]">
												{project.description}
											</p>
										</div>
										<svg
											className="mt-1 shrink-0 text-[var(--sea-ink-soft)] group-hover:text-[var(--lagoon-deep)] transition-colors"
											width="18"
											height="18"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<title>demo</title>
											<path d="M5 12h14M12 5l7 7-7 7" />
										</svg>
									</div>
									<div className="mt-4 flex flex-wrap gap-2">
										{project.stack.map((tech) => (
											<span
												key={tech}
												className="rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-2.5 py-0.5 text-xs font-medium text-[var(--sea-ink-soft)]"
											>
												{tech}
											</span>
										))}
									</div>
								</div>
							</div>
						</Link>
					</motion.div>
				))}
			</div>
		</div>
	);
}
