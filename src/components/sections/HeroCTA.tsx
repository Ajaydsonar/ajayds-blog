// src/components/sections/HeroCTA.tsx

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const services = [
	{
		badge: "AI Integration / MVP",
		theme: "indigo" as const,
		tagline: "Ship your vision, not just your code.",
		subtext: (
			<>
				Custom AI-powered web apps built for solo founders who need to move fast
				— from Next.js frontends to Python-powered backends.{" "}
				<strong className="font-semibold text-indigo-400">
					Get a production-ready MVP that thinks, learns, and scales.
				</strong>
			</>
		),
		cta: "Start building your MVP",
	},
	{
		badge: "AI Workflow Automation",
		theme: "emerald" as const,
		tagline: "Stop doing the work your software should be doing.",
		subtext: (
			<>
				I bridge the gap between your manual processes and intelligent
				automation using Node.js and Python.{" "}
				<strong className="font-semibold text-emerald-400">
					Save 20+ hours a week — guaranteed.
				</strong>
			</>
		),
		cta: "Automate my workflow",
	},
	{
		badge: "Data / Dashboards",
		theme: "amber" as const,
		tagline:
			"Your next big move is already in your data — you just can't see it yet.",
		subtext: (
			<>
				I build robust data scrapers, pipelines, and AI-driven analytics tools
				that{" "}
				<strong className="font-semibold text-amber-400">
					transform raw numbers into your company's competitive advantage.
				</strong>
			</>
		),
		cta: "Unlock my data",
	},
] as const;

const INTERVAL = 10000;

// Unified Theme Configuration
const themeConfig = {
	indigo: {
		cardBg: "bg-indigo-50/50 dark:bg-indigo-950/20",
		interactive:
			"text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/50 bg-white dark:bg-zinc-950 hover:bg-indigo-50 dark:hover:bg-indigo-950/50",
		accent: "bg-indigo-500 dark:bg-indigo-400",
	},
	emerald: {
		cardBg: "bg-emerald-50/50 dark:bg-emerald-950/20",
		interactive:
			"text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50 bg-white dark:bg-zinc-950 hover:bg-emerald-50 dark:hover:bg-emerald-950/50",
		accent: "bg-emerald-500 dark:bg-emerald-400",
	},
	amber: {
		cardBg: "bg-amber-50/50 dark:bg-amber-950/20",
		interactive:
			"text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/50 bg-white dark:bg-zinc-950 hover:bg-amber-50 dark:hover:bg-amber-950/50",
		accent: "bg-amber-500 dark:bg-amber-400",
	},
} satisfies Record<(typeof services)[number]["theme"], Record<string, string>>;

function ArrowRight({ size = 16 }: { size?: number }) {
	return (
		<svg
			width={size}
			height={size}
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
	);
}

function ArrowLeft({ size = 16 }: { size?: number }) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M19 12H5M12 19l-7-7 7-7" />
		</svg>
	);
}

export function HeroCTA({
	onSlideChange,
}: {
	onSlideChange?: (index: number) => void;
}) {
	const [current, setCurrent] = useState(0);
	const [isPaused, setIsPaused] = useState(false);

	const cardRef = useRef<HTMLDivElement>(null);
	const progressBarRef = useRef<HTMLDivElement>(null);
	const progressValueRef = useRef(0);
	const lastUpdateRef = useRef(Date.now());

	const activeTheme = themeConfig[services[current].theme];

	const goTo = (idx: number) => {
		setCurrent(((idx % services.length) + services.length) % services.length);
		progressValueRef.current = 0;
		setIsPaused(false);
	};

	const navigate = (dir: 1 | -1) => goTo(current + dir);

	// 2. Add this tiny useEffect to report the change
	useEffect(() => {
		if (onSlideChange) {
			onSlideChange(current);
		}
	}, [current, onSlideChange]);

	useEffect(() => {
		let rafId: number;
		lastUpdateRef.current = Date.now();

		const loop = () => {
			const now = Date.now();
			const delta = now - lastUpdateRef.current;
			lastUpdateRef.current = now;

			if (!isPaused) {
				progressValueRef.current += (delta / INTERVAL) * 100;

				if (progressValueRef.current >= 100) {
					progressValueRef.current = 0;
					setCurrent((c) => (c + 1) % services.length);
				}

				if (progressBarRef.current) {
					progressBarRef.current.style.transform = `scaleX(${progressValueRef.current / 100})`;
				}
			}
			rafId = requestAnimationFrame(loop);
		};

		rafId = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(rafId);
	}, [isPaused]);

	useEffect(() => {
		const handleInteract = (e: MouseEvent | TouchEvent) => {
			if (cardRef?.current?.contains(e.target as Node)) {
				const isNav = (e.target as HTMLElement).closest("[data-nav-control]");
				if (!isNav) setIsPaused(true);
			} else {
				setIsPaused(false);
			}
		};

		document.addEventListener("mousedown", handleInteract);
		document.addEventListener("click", handleInteract, {
			passive: true,
		});
		return () => {
			document.removeEventListener("mousedown", handleInteract);
			document.removeEventListener("click", handleInteract);
		};
	}, []);

	return (
		<section className="page-wrap mt-10">
			<motion.div
				initial={{ opacity: 0, y: 14 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
			>
				{/* Themed Card Wrapper */}
				<div
					ref={cardRef}
					className={`island-shell relative overflow-hidden rounded-2xl border border-black/5 dark:border-white/5 shadow-sm transition-all duration-700 hover:shadow-md ${activeTheme.cardBg}`}
				>
					{/* Top Accent Glowing Line */}
					<div className="absolute top-0 left-6 right-6 h-[2px] overflow-hidden rounded-b-md">
						<div
							className={`absolute inset-0 origin-left opacity-80 transition-colors duration-700 ${activeTheme.accent}`}
						/>
					</div>

					{/* Core Content Layout */}
					<div className="flex flex-col justify-between p-6 sm:p-8">
						{/* CSS Grid ensures zero layout shift */}
						<div className="grid">
							{services.map((service, i) => {
								const isActive = i === current;
								const serviceTheme = themeConfig[service.theme];
								return (
									<div
										// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
										key={`slide-text-${i}`}
										className={`col-start-1 row-start-1 flex flex-col items-start transition-all duration-700 ease-[0.22,1,0.36,1] ${
											isActive
												? "opacity-100 translate-y-0 z-10 pointer-events-auto"
												: "opacity-0 translate-y-3 z-0 pointer-events-none"
										}`}
										aria-hidden={!isActive}
									>
										{/* Themed Badge */}
										<span
											className={`mb-4 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase transition-colors duration-500 ${serviceTheme.interactive}`}
										>
											<span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
											{service.badge}
										</span>

										{/* Tagline */}
										<h2 className="text-xl sm:text-2xl font-semibold leading-tight text-zinc-900 dark:text-zinc-50 tracking-tight max-w-xl">
											{service.tagline}
										</h2>

										{/* Subtext */}
										<p className="mt-3 text-sm sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-400 max-w-lg">
											{service.subtext}
										</p>
									</div>
								);
							})}
						</div>

						{/* Footer: CTA & Navigation Controls */}
						<div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-black/5 dark:border-white/5 pt-6">
							{/* Dynamic CTA Grid */}
							<div className="grid w-full sm:w-auto">
								{services.map((service, i) => {
									const serviceTheme = themeConfig[service.theme];
									return (
										<button
											type="button"
											key={`slide-cta-${
												// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
												i
											}`}
											className={`col-start-1 row-start-1 inline-flex w-max items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium shadow-sm transition-all duration-500 ease-[0.22,1,0.36,1] hover:scale-[0.98] active:scale-95 ${serviceTheme.interactive} ${
												i === current
													? "opacity-100 translate-x-0 z-10 pointer-events-auto"
													: "opacity-0 -translate-x-2 z-0 pointer-events-none"
											}`}
										>
											{service.cta}
											<ArrowRight />
										</button>
									);
								})}
							</div>

							{/* Static Navigation Area */}
							<div
								className="flex items-center gap-3 shrink-0"
								data-nav-control="true"
							>
								<button
									type="button"
									onClick={() => navigate(-1)}
									aria-label="Previous service"
									className="group flex h-9 w-9 items-center justify-center rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-950 text-zinc-500 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100"
								>
									<span className="transition-transform group-hover:-translate-x-0.5">
										<ArrowLeft />
									</span>
								</button>

								{/* Dots */}
								<div className="flex items-center gap-2 px-1">
									{services.map((_, i) => (
										<button
											type="button"
											// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
											key={i}
											onClick={() => goTo(i)}
											aria-label={`Go to service ${i + 1}`}
											className={`rounded-full transition-all duration-300 ${
												i === current
													? `h-2 w-5 ${activeTheme.accent}`
													: "h-2 w-2 bg-black/20 dark:bg-white/20 hover:bg-black/40 dark:hover:bg-white/40"
											}`}
										/>
									))}
								</div>

								<button
									type="button"
									onClick={() => navigate(1)}
									aria-label="Next service"
									className="group flex h-9 w-9 items-center justify-center rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-950 text-zinc-500 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100"
								>
									<span className="transition-transform group-hover:translate-x-0.5">
										<ArrowRight />
									</span>
								</button>
							</div>
						</div>
					</div>

					{/* Bottom Hardware-Accelerated Progress Bar */}
					<div className="absolute bottom-0 left-0 h-[3px] w-full bg-black/5 dark:bg-white/5">
						<div
							ref={progressBarRef}
							className={`h-full origin-left transition-colors duration-700 ${activeTheme.accent}`}
							style={{ transform: "scaleX(0)" }}
						/>
					</div>
				</div>
			</motion.div>
		</section>
	);
}
