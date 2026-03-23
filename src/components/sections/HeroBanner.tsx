// src/components/sections/HeroBanner.tsx
import { motion, type Variants } from "motion/react";

const services = [
	{
		statusText: "Open to your next big idea",
		theme: "indigo" as const,
		bannerBg: "bg-indigo-50/50 dark:bg-indigo-950/20",
		bannerBorder: "border-indigo-200 dark:border-indigo-400/70", // <--- Added full string
		headline: (
			<>
				I Build{" "}
				<span className="text-indigo-600 dark:text-indigo-400">
					AI Powered Features/MVPs
				</span>{" "}
				<br className="hidden sm:block" /> for Solo Founders and Small Teams
			</>
		),
	},
	{
		statusText: "Open to automate your boring work",
		theme: "emerald" as const,
		bannerBg: "bg-emerald-50/50 dark:bg-emerald-950/20",
		bannerBorder: "border-emerald-200 dark:border-emerald-400/70", // <--- Added full string
		headline: (
			<>
				I Build{" "}
				<span className="text-emerald-600 dark:text-emerald-400">
					AI Powered Automation
				</span>{" "}
				<br className="hidden sm:block" /> For Small Businesses
			</>
		),
	},
	{
		statusText: "Open to uncovering hidden insights",
		theme: "amber" as const,
		bannerBg: "bg-amber-50/50 dark:bg-amber-950/20",
		bannerBorder: "border-amber-200 dark:border-amber-400/70", // <--- Added full string
		headline: (
			<>
				I Build{" "}
				<span className="text-amber-600 dark:text-amber-400">
					AI Powered Data Pipelines
				</span>{" "}
				<br className="hidden sm:block" /> and Dashboards
			</>
		),
	},
] as const;

const badgeTheme = {
	indigo: {
		wrapper:
			"border-indigo-200 bg-indigo-50/80 text-indigo-600 dark:border-indigo-800/50 dark:bg-indigo-950/50 dark:text-indigo-400",
		dot: "bg-indigo-500 dark:bg-indigo-400",
	},
	emerald: {
		wrapper:
			"border-emerald-200 bg-emerald-50/80 text-emerald-600 dark:border-emerald-800/50 dark:bg-emerald-950/50 dark:text-emerald-400",
		dot: "bg-emerald-500 dark:bg-emerald-400",
	},
	amber: {
		wrapper:
			"border-amber-200 bg-amber-50/80 text-amber-700 dark:border-amber-800/50 dark:bg-amber-950/50 dark:text-amber-400",
		dot: "bg-amber-500 dark:bg-amber-400",
	},
};

// Banner animates in first — fades + very subtle scale-down
const bannerVariants: Variants = {
	hidden: { opacity: 0, scale: 1.04 },
	show: {
		opacity: 0.8,
		scale: 1,
		transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
	},
};

// Profile container staggers children after the banner lands
const container: Variants = {
	hidden: {},
	show: {
		transition: {
			delayChildren: 0.5,
			staggerChildren: 0.1,
		},
	},
};

const item: Variants = {
	hidden: { opacity: 0, y: 16 },
	show: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
	},
};

// Avatar pops in with a subtle scale
const avatarItem: Variants = {
	hidden: { opacity: 0, scale: 0.85 },
	show: {
		opacity: 1,
		scale: 1,
		transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
	},
};

export function HeroBanner({ current }: { current: number }) {
	return (
		<section className="relative w-full">
			{/* ── Cover / Banner ───────────────────────────── */}
			<motion.div
				variants={bannerVariants}
				initial="hidden"
				animate="show"
				className={`relative h-48 w-full overflow-hidden -z-10 sm:h-56 transition-colors duration-700 border-b 
					${services[current].bannerBorder} ${services[current].bannerBg}`}
			>
				<div className="absolute inset-0 flex flex-col items-center justify-center px-6 pb-12 sm:pb-8 sm:pl-32 md:pl-48">
					<div className="grid justify-items-center sm:justify-items-start w-full max-w-2xl text-center sm:text-left">
						{services.map((service, i) => {
							const isActive = i === current;
							return (
								<div
									key={`banner-headline-${i}`}
									aria-hidden={!isActive}
									className={`col-start-1 row-start-1 transition-all duration-700 ease-[0.22,1,0.36,1] ${
										isActive
											? "opacity-100 translate-y-0 z-10 scale-100"
											: "opacity-0 translate-y-3 z-0 scale-95 pointer-events-none"
									}`}
								>
									<h2 className="text-lg sm:text-2xl md:text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
										{service.headline}
									</h2>
								</div>
							);
						})}
					</div>
				</div>
			</motion.div>

			{/* ── Profile section ──────────────────────────── */}
			{/*
			 * page-wrap gives us the horizontal padding.
			 * We add sm:pl-8 so the avatar gets breathing room from the left edge.
			 */}
			<div className="page-wrap sm:pl-8">
				<motion.div variants={container} initial="hidden" animate="show">
					{/*
					 * LAYOUT ROW
					 * Mobile  → column, centered
					 * Desktop → row: avatar on the left, info block to its right,
					 *           both baseline-aligned at the bottom of the overlap zone
					 */}
					<div className="flex w-full flex-col items-center -mt-14 sm:-mt-16  text-center sm:flex-row sm:items-end sm:text-left sm:gap-6">
						{/* ── Avatar — pulled up over the banner ── */}
						<motion.div variants={avatarItem} className="shrink-0 ">
							<div className="h-28 w-28 rounded-full ring-4 ring-(--bg-base) sm:h-36 sm:w-36">
								{/* Placeholder — swap for <img> later */}
								<div className="flex h-full w-full items-center justify-center rounded-full bg-linear-to-br from-(--lagoon-deep) to-(--palm) text-4xl font-bold text-white">
									A
								</div>
							</div>
						</motion.div>

						{/* ── Info block ── */}
						<div className="flex flex-col grow md:flex-row md:gap-6 items-center sm:items-start sm:pb-1">
							<div className="text-center">
								{/* Name + handle */}
								<motion.div
									variants={item}
									className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 sm:mt-0 sm:justify-start"
								>
									<h1 className="display-title text-2xl font-bold text-(--sea-ink) sm:text-3xl">
										Ajay DS
									</h1>
									<span className="island-kicker">@ajayds</span>
								</motion.div>

								{/* Compelling badge */}
								<motion.div
									variants={item}
									className="mt-2 grid justify-items-center sm:justify-items-start"
								>
									{services.map((service, i) => {
										const isActive = i === current;
										const themeClass = badgeTheme[service.theme];

										return (
											<span
												key={`status-badge-${i}`}
												aria-hidden={!isActive}
												className={`col-start-1 row-start-1 inline-flex w-max items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-700 ease-[0.22,1,0.36,1] ${themeClass.wrapper} ${
													isActive
														? "opacity-100 translate-y-0 z-10 pointer-events-auto"
														: "opacity-0 translate-y-2 z-0 pointer-events-none"
												}`}
											>
												{/* Ping Indicator */}
												<span className="relative flex h-2 w-2">
													<span
														className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${themeClass.dot}`}
													/>
													<span
														className={`relative inline-flex h-2 w-2 rounded-full ${themeClass.dot}`}
													/>
												</span>

												{/* Dynamic Text */}
												{service.statusText}
											</span>
										);
									})}
								</motion.div>
							</div>

							{/* Tagline */}
							<motion.p
								variants={item}
								className="mt-3 max-w-sm text-sm leading-relaxed text-(--sea-ink-soft) sm:text-base"
							>
								I build AI powered web apps, custom data pipelines &amp;
								automations — from idea to deployment.
							</motion.p>

							{/* Social links */}
							<motion.div
								variants={item}
								className="mt-4 md:ml-auto md:mr-8 flex items-center justify-center gap-4 sm:justify-start"
							>
								<a
									href="https://github.com/ajayds"
									target="_blank"
									rel="noopener noreferrer"
									className="text-(--sea-ink-soft) transition hover:text-(--lagoon-deep)"
								>
									<span className="sr-only">GitHub</span>
									<svg
										aria-hidden="true"
										width="18"
										height="18"
										viewBox="0 0 24 24"
										fill="currentColor"
									>
										<path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
									</svg>
								</a>

								<a
									href="https://twitter.com/ajayds"
									target="_blank"
									rel="noopener noreferrer"
									className="text-(--sea-ink-soft) transition hover:text-(--lagoon-deep)"
								>
									<span className="sr-only">X / Twitter</span>
									<svg
										aria-hidden="true"
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="currentColor"
									>
										<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
									</svg>
								</a>

								<a
									href="mailto:ajay@ajayds.com"
									className="text-(--sea-ink-soft) transition hover:text-(--lagoon-deep)"
								>
									<span className="sr-only">Email</span>
									<svg
										aria-hidden="true"
										width="18"
										height="18"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<rect width="20" height="16" x="2" y="4" rx="2" />
										<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
									</svg>
								</a>
							</motion.div>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
