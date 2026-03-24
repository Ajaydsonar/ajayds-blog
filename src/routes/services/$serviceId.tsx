// src/routes/services/$serviceId.tsx
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ContactCTA } from "@/components/shared/ContactCTA";
import { getProjectsByIds } from "@/data/c/projects";
import { getService } from "@/data/c/services";

export const Route = createFileRoute("/services/$serviceId")({
	// Loader runs before the component renders — on the server in SSR
	loader: ({ params }) => {
		const service = getService(params.serviceId);
		if (!service) throw notFound();
		const relatedProjects = getProjectsByIds(service.relatedProjectIds);
		return { service, relatedProjects };
	},
	component: ServiceDetailPage,
	// notFoundComponent shown when loader throws notFound()
	notFoundComponent: () => (
		<div className="page-wrap py-32 text-center">
			<h1 className="display-title text-2xl font-bold text-[var(--sea-ink)]">
				Service not found
			</h1>
			<Link
				to="/services"
				className="mt-4 inline-block text-sm text-[var(--lagoon-deep)]"
			>
				← Back to services
			</Link>
		</div>
	),
});

function ServiceDetailPage() {
	const { service, relatedProjects } = Route.useLoaderData();

	return (
		<div>
			<div className="mx-6 md:mx-auto md:w-3/5">
				{/* Back link */}
				<div className="page-wrap pt-10">
					<Link
						to="/services"
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
							<title>All Services</title>
							<path d="M19 12H5M12 19l-7-7 7-7" />
						</svg>
						All services
					</Link>
				</div>

				{/* Hero */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
					className="page-wrap pt-8 pb-12"
				>
					<p className="island-kicker mb-3">Service</p>
					<h1 className="display-title text-3xl font-bold text-[var(--sea-ink)] sm:text-4xl">
						{service.title}
					</h1>
					<p className="mt-2 text-base font-medium text-[var(--lagoon-deep)]">
						{service.tagline}
					</p>
					<p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--sea-ink-soft)] sm:text-base">
						{service.description}
					</p>
				</motion.div>

				{/* What's included */}
				<motion.section
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-40px" }}
					transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
					className="page-wrap mb-14"
				>
					<h2 className="display-title mb-6 text-xl font-bold text-[var(--sea-ink)]">
						What's included
					</h2>
					<div className="island-shell rounded-2xl border border-[var(--line)] p-6">
						<ul className="grid gap-3 sm:grid-cols-2">
							{service.deliverables.map((item, i) => (
								<motion.li
									key={item}
									initial={{ opacity: 0, x: -12 }}
									whileInView={{ opacity: 1, x: 0 }}
									viewport={{ once: true }}
									transition={{
										duration: 0.35,
										delay: i * 0.06,
										ease: [0.22, 1, 0.36, 1],
									}}
									className="flex items-start gap-2.5 text-sm text-[var(--sea-ink-soft)]"
								>
									<svg
										className="mt-0.5 shrink-0 text-[var(--palm)]"
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<title>All Services</title>
										<path d="M20 6 9 17l-5-5" />
									</svg>
									{item}
								</motion.li>
							))}
						</ul>
					</div>
				</motion.section>

				{/* My process */}
				<motion.section
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-40px" }}
					transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
					className="page-wrap mb-14"
				>
					<h2 className="display-title mb-6 text-xl font-bold text-[var(--sea-ink)]">
						How I work
					</h2>
					<div className="relative flex flex-col gap-0">
						{service.process.map((step, i) => (
							<motion.div
								key={step.step}
								initial={{ opacity: 0, x: -16 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{
									duration: 0.4,
									delay: i * 0.1,
									ease: [0.22, 1, 0.36, 1],
								}}
								className="relative flex gap-5 pb-8 last:pb-0"
							>
								{/* Vertical line connecting steps */}
								{i < service.process.length - 1 && (
									<div className="absolute left-5 top-10 h-full w-px bg-[var(--line)]" />
								)}

								{/* Step number bubble */}
								<div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] text-sm font-bold text-[var(--lagoon-deep)]">
									{step.step}
								</div>

								<div className="pt-1.5">
									<h3 className="font-semibold text-[var(--sea-ink)]">
										{step.title}
									</h3>
									<p className="mt-1 text-sm leading-relaxed text-[var(--sea-ink-soft)]">
										{step.description}
									</p>
								</div>
							</motion.div>
						))}
					</div>
				</motion.section>

				{/* Related projects */}
				{relatedProjects.length > 0 && (
					<motion.section
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-40px" }}
						transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
						className="page-wrap mb-14"
					>
						<div className="mb-6 flex items-center justify-between">
							<h2 className="display-title text-xl font-bold text-[var(--sea-ink)]">
								Past work
							</h2>
							<Link
								to="/portfolio"
								className="text-xs font-semibold text-[var(--lagoon-deep)] no-underline hover:underline"
							>
								All projects →
							</Link>
						</div>
						<div className="flex flex-col gap-4">
							{relatedProjects.map((project) => (
								<Link
									key={project.id}
									to="/portfolio/$projectId"
									params={{ projectId: project.id }}
									className="group block no-underline"
								>
									<div className="feature-card island-shell flex items-start justify-between gap-4 rounded-xl border border-[var(--line)] p-5 transition">
										<div className="flex-1 min-w-0">
											<h3 className="font-semibold text-[var(--sea-ink)] group-hover:text-[var(--lagoon-deep)] transition-colors">
												{project.title}
											</h3>
											<p className="mt-1 text-sm text-[var(--sea-ink-soft)]">
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
											<title>All Services</title>

											<path d="M5 12h14M12 5l7 7-7 7" />
										</svg>
									</div>
								</Link>
							))}
						</div>
					</motion.section>
				)}
			</div>
			<ContactCTA
				heading={`Interested in ${service.title.toLowerCase()}?`}
				subtext="Let's talk about your project. No commitment, just a conversation."
			/>
		</div>
	);
}
