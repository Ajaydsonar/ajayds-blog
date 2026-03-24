// src/routes/portfolio/$projectId.tsx
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ContactCTA } from "@/components/shared/ContactCTA";
import { getProject } from "@/data/projects";
import { services } from "@/data/services";

export const Route = createFileRoute("/portfolio/$projectId")({
	loader: ({ params }) => {
		const project = getProject(params.projectId);
		if (!project) throw notFound();
		// Find which services this project relates to
		const relatedServices = services.filter((s) =>
			project.serviceIds.includes(s.id),
		);
		return { project, relatedServices };
	},
	component: ProjectDetailPage,
	notFoundComponent: () => (
		<div className="page-wrap py-32 text-center">
			<h1 className="display-title text-2xl font-bold text-[var(--sea-ink)]">
				Project not found
			</h1>
			<Link
				to="/portfolio"
				className="mt-4 inline-block text-sm text-[var(--lagoon-deep)]"
			>
				← Back to portfolio
			</Link>
		</div>
	),
});

function ProjectDetailPage() {
	const { project, relatedServices } = Route.useLoaderData();

	return (
		<div>
			<div className="mx-6 md:mx-auto md:w-3/5">
				{/* Back */}
				<div className="page-wrap pt-10">
					<Link
						to="/portfolio"
						className="inline-flex items-center gap-1.5 text-sm text-[var(--sea-ink-soft)] no-underline hover:text-[var(--lagoon-deep)] transition-colors"
					>
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<title>All projects</title>
							<path d="M19 12H5M12 19l-7-7 7-7" />
						</svg>
						All projects
					</Link>
				</div>

				{/* Hero */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
					className="page-wrap pt-8 pb-10"
				>
					<h1 className="display-title text-3xl font-bold text-[var(--sea-ink)] sm:text-4xl">
						{project.title}
					</h1>
					<p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--sea-ink-soft)] sm:text-base">
						{project.longDescription}
					</p>

					<div className="mt-6 flex flex-wrap items-center gap-3">
						{/* Live site link */}
						<motion.a
							href={project.liveUrl}
							target="_blank"
							rel="noopener noreferrer"
							whileHover={{ scale: 1.03, y: -2 }}
							whileTap={{ scale: 0.97 }}
							className="inline-flex items-center gap-2 rounded-xl border border-[var(--chip-line)] bg-[var(--chip-bg)] px-5 py-2.5 text-sm font-semibold text-[var(--sea-ink)] no-underline shadow-sm transition hover:shadow-md"
						>
							<span className="h-2 w-2 rounded-full bg-[#25D366]" />
							View live site
							<svg
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<title>View live site</title>
								<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
								<polyline points="15 3 21 3 21 9" />
								<line x1="10" y1="14" x2="21" y2="3" />
							</svg>
						</motion.a>

						{/* Stack chips */}
						<div className="flex flex-wrap gap-2">
							{project.stack.map((tech) => (
								<span
									key={tech}
									className="rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-2.5 py-1 text-xs font-medium text-[var(--sea-ink-soft)]"
								>
									{tech}
								</span>
							))}
						</div>
					</div>
				</motion.div>

				{/* Screenshots */}
				{project.screenshots.length > 0 && (
					<motion.section
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
						className="page-wrap mb-14"
					>
						<div className="flex flex-col gap-4">
							{project.screenshots.map((src, i) => (
								<motion.div
									key={src}
									initial={{ opacity: 0, scale: 0.98 }}
									whileInView={{ opacity: 1, scale: 1 }}
									viewport={{ once: true }}
									transition={{
										duration: 0.5,
										delay: i * 0.1,
										ease: [0.22, 1, 0.36, 1],
									}}
									className="overflow-hidden rounded-2xl border border-[var(--line)]"
								>
									{/* Gradient placeholder shown if image fails to load */}
									<div className="relative min-h-48 bg-gradient-to-br from-[var(--lagoon)] via-[var(--palm)] to-[var(--sea-ink)] opacity-50">
										<img
											src={src}
											alt={`${project.title} screenshot ${i + 1}`}
											className="w-full object-cover"
											onError={(e) => {
												e.currentTarget.style.display = "none";
											}}
										/>
									</div>
								</motion.div>
							))}
						</div>
					</motion.section>
				)}

				{/* Related services */}
				{relatedServices.length > 0 && (
					<motion.section
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
						className="page-wrap mb-14"
					>
						<h2 className="display-title mb-4 text-lg font-bold text-[var(--sea-ink)]">
							Related services
						</h2>
						<div className="flex flex-wrap gap-3">
							{relatedServices.map((service) => (
								<Link
									key={service.id}
									to="/services/$serviceId"
									params={{ serviceId: service.id }}
									className="rounded-xl border border-[var(--chip-line)] bg-[var(--chip-bg)] px-4 py-2 text-sm font-semibold text-[var(--lagoon-deep)] no-underline transition hover:bg-[var(--link-bg-hover)]"
								>
									{service.title} →
								</Link>
							))}
						</div>
					</motion.section>
				)}
			</div>
			<ContactCTA
				heading="Want something like this?"
				subtext="I'm available for new projects. Let's talk about what you need."
			/>
		</div>
	);
}
