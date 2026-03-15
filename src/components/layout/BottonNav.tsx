// src/components/layout/BottomNav.tsx
import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";

const tabs = [
	{
		to: "/",
		label: "Home",
		icon: ({ active }: { active: boolean }) => (
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth={active ? 2.2 : 1.8}
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<title>home</title>
				<path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" />
				<polyline points="9 21 9 12 15 12 15 21" />
			</svg>
		),
	},
	{
		to: "/blog",
		label: "Blog",
		icon: ({ active }: { active: boolean }) => (
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth={active ? 2.2 : 1.8}
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<title>blog</title>
				<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
				<polyline points="14 2 14 8 20 8" />
				<line x1="16" y1="13" x2="8" y2="13" />
				<line x1="16" y1="17" x2="8" y2="17" />
			</svg>
		),
	},
	{
		to: "/portfolio",
		label: "Work",
		icon: ({ active }: { active: boolean }) => (
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth={active ? 2.2 : 1.8}
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<title>portfolio</title>

				<rect x="2" y="7" width="20" height="14" rx="2" />
				<path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
			</svg>
		),
	},
	{
		to: "/services",
		label: "Services",
		icon: ({ active }: { active: boolean }) => (
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth={active ? 2.2 : 1.8}
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<title>services</title>
				<polyline points="16 18 22 12 16 6" />
				<polyline points="8 6 2 12 8 18" />
			</svg>
		),
	},
];

export function BottomNav() {
	const routerState = useRouterState();
	const currentPath = routerState.location.pathname;

	return (
		<nav
			aria-label="Main navigation"
			// Centered floating dock instead of full-width
			className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 pointer-events-none"
		>
			<motion.div
				initial={{ y: 40, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				// Snappier entrance animation
				transition={{ type: "spring", stiffness: 400, damping: 30 }}
				className="
                    pointer-events-auto
                    flex items-center gap-1 p-1.5
                    rounded-full
                    
                    bg-white/70 dark:bg-neutral-900/70
                    backdrop-blur-2xl
                    
                    border border-black/5 dark:border-white/10
                    shadow-2xl shadow-black/10 dark:shadow-black/40
                "
			>
				{tabs.map((tab) => {
					const isActive =
						currentPath === tab.to ||
						(tab.to !== "/" && currentPath.startsWith(tab.to));

					return (
						<Link
							key={tab.to}
							to={tab.to}
							aria-label={tab.label}
							aria-current={isActive ? "page" : undefined}
							className="
                                relative rounded-full outline-none 
                                focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white
                            "
						>
							{/* ACTIVE BACKGROUND PILL */}
							{isActive && (
								<motion.div
									layoutId="bottom-nav-indicator"
									className="absolute inset-0 rounded-full bg-neutral-900 dark:bg-white"
									transition={{
										type: "spring",
										stiffness: 500, // Increased stiffness for faster, sleeker feel
										damping: 35,
									}}
								/>
							)}

							{/* CONTENT (ICON + TEXT) */}
							<div className="relative z-10 flex items-center justify-center gap-2 px-4 py-2.5">
								<span
									className={`
                                        transition-colors duration-200
                                        ${
																					isActive
																						? "text-white dark:text-neutral-900"
																						: "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
																				}
                                    `}
								>
									<tab.icon active={isActive} />
								</span>

								{/* EXPANDING LABEL */}
								<AnimatePresence>
									{isActive && (
										<motion.span
											initial={{ width: 0, opacity: 0 }}
											animate={{ width: "auto", opacity: 1 }}
											exit={{ width: 0, opacity: 0 }}
											transition={{ duration: 0.2, ease: "easeOut" }}
											className="overflow-hidden whitespace-nowrap text-sm font-semibold text-white dark:text-neutral-900"
										>
											{tab.label}
										</motion.span>
									)}
								</AnimatePresence>
							</div>
						</Link>
					);
				})}
			</motion.div>
		</nav>
	);
}
