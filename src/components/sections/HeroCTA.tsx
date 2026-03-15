// src/components/sections/HeroCTA.tsx
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";

export function HeroCTA() {
	return (
		<section className="page-wrap mt-10">
			<Link to="/services" className="group block no-underline">
				<motion.div
					whileHover={{ scale: 1.015 }}
					whileTap={{ scale: 0.98 }}
					transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
					className="island-shell relative overflow-hidden rounded-2xl px-8 py-8 sm:px-12 sm:py-10"
				>
					{/* Animated background orb — moves slowly on loop */}
					<motion.div
						animate={{
							x: [0, 30, 0, -20, 0],
							y: [0, -20, 10, 20, 0],
							scale: [1, 1.1, 0.95, 1.05, 1],
						}}
						transition={{
							duration: 10,
							repeat: Infinity,
							ease: "easeInOut",
						}}
						className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[var(--lagoon)] opacity-20 blur-3xl"
					/>
					<motion.div
						animate={{
							x: [0, -20, 10, 30, 0],
							y: [0, 20, -10, -20, 0],
						}}
						transition={{
							duration: 13,
							repeat: Infinity,
							ease: "easeInOut",
							delay: 2,
						}}
						className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-[var(--palm)] opacity-15 blur-3xl"
					/>

					{/* Content */}
					<div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<p className="island-kicker mb-2">Available for projects</p>
							<h2 className="display-title text-2xl font-bold text-[var(--sea-ink)] sm:text-3xl lg:text-4xl">
								Let's build something great.
							</h2>
							<p className="mt-2 text-sm text-[var(--sea-ink-soft)]">
								Web apps · APIs · Automations · Consulting
							</p>
						</div>

						{/* Arrow button */}
						<motion.div
							whileHover={{ x: 4 }}
							transition={{ duration: 0.2 }}
							className="flex shrink-0 items-center gap-2 rounded-xl border border-[var(--chip-line)] bg-[var(--chip-bg)] px-6 py-3 text-sm font-semibold text-[var(--sea-ink)] sm:mt-0"
						>
							Hire Me
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<title>hire me</title>
								<path d="M5 12h14M12 5l7 7-7 7" />
							</svg>
						</motion.div>
					</div>
				</motion.div>
			</Link>
		</section>
	);
}
