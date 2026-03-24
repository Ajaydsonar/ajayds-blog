// src/components/sections/FeaturedProjects.tsx
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { projects } from "@/data/projects";

const featuredIds = ["sellerpilot", "nocalllost", "marginmonster"];
const featured = featuredIds
	.map((id) => projects.find((p) => p.id === id))
	.filter(Boolean) as typeof projects;

export function FeaturedProjects() {
	return (
		<section className="page-wrap mt-14">
			{/* Section header */}
			<div className="mb-6 flex items-center justify-between">
				<h2 className="display-title text-xl font-bold text-[var(--sea-ink)]">
					Featured Projects
				</h2>
				<Link
					to="/portfolio"
					className="text-xs font-semibold text-[var(--lagoon-deep)] no-underline hover:underline"
				>
					View all →
				</Link>
			</div>

			{/* Cards */}
			<div className="flex flex-col gap-4">
				{featured.map((project, i) => (
					<motion.div
						key={project.id}
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-40px" }}
						transition={{
							duration: 0.5,
							delay: i * 0.08,
							ease: [0.22, 1, 0.36, 1],
						}}
					>
						<Link
							to="/portfolio/$projectId"
							params={{ projectId: project.id }}
							className="group block no-underline"
						>
							<div className="feature-card island-shell flex items-start justify-between gap-4 rounded-xl border border-[var(--line)] p-5 transition">
								<div className="flex-1 min-w-0">
									<h3 className="font-semibold text-[var(--sea-ink)] group-hover:text-[var(--lagoon-deep)] transition-colors">
										{project.title}
									</h3>
									<p className="mt-1 text-sm leading-relaxed text-[var(--sea-ink-soft)]">
										{project.description}
									</p>
									<div className="mt-3 flex flex-wrap gap-2">
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

								{/* Arrow */}
								<motion.div
									whileHover={{ x: 3 }}
									className="mt-1 shrink-0 text-[var(--sea-ink-soft)] group-hover:text-[var(--lagoon-deep)] transition-colors"
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
										aria-hidden="true"
									>
										<path d="M5 12h14M12 5l7 7-7 7" />
									</svg>
								</motion.div>
							</div>
						</Link>
					</motion.div>
				))}
			</div>
		</section>
	);
}
