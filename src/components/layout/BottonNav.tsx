// src/components/layout/BottomNav.tsx
import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "motion/react";
import { memo, useMemo } from "react";

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

const NavTab = memo(function NavTab({
	tab,
	isActive,
}: {
	tab: (typeof tabs)[number];
	isActive: boolean;
}) {
	return (
		<Link
			key={tab.to}
			to={tab.to}
			preload="intent" // 🚀 OPTIMIZATION 1: Preload next route on hover/touch
			aria-label={tab.label}
			aria-current={isActive ? "page" : undefined}
			className="relative rounded-full outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white"
		>
			{isActive && (
				<motion.div
					layoutId="bottom-nav-indicator"
					className="absolute inset-0 rounded-full bg-neutral-900 dark:bg-white"
					transition={{
						type: "spring",
						stiffness: 500, // Slightly tuned for snappiness
						damping: 35,
						mass: 0.8,
					}}
					style={{ willChange: "transform" }} // 🚀 OPTIMIZATION 2: Force GPU compositing
				/>
			)}

			{/* 🚀 OPTIMIZATION 3: Removed gap-2 to prevent spacing bugs when width is 0 */}
			<div className="relative z-10 flex items-center justify-center px-4 py-2.5">
				<span
					className={`transition-colors duration-150 relative z-10 ${
						isActive
							? "text-white dark:text-neutral-900"
							: "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
					}`}
				>
					<tab.icon active={isActive} />
				</span>

				{/*
                  🚀 OPTIMIZATION 4: Removed AnimatePresence.
                  We now keep the DOM node mounted and animate width to "auto".
                  This avoids expensive DOM mounting/unmounting during route transitions.
                */}
				<motion.div
					initial={false}
					animate={{
						width: isActive ? "auto" : 0,
						opacity: isActive ? 1 : 0,
					}}
					transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
					className="overflow-hidden whitespace-nowrap"
					style={{ willChange: "width, opacity" }}
				>
					{/* The gap spacing is now simulated by pl-2 (padding-left) inside the hidden wrapper */}
					<span className="block pl-2 text-sm font-semibold text-white dark:text-neutral-900">
						{tab.label}
					</span>
				</motion.div>
			</div>
		</Link>
	);
});

export function BottomNav() {
	const currentPath = useRouterState({ select: (s) => s.location.pathname });

	const activeStates = useMemo(
		() =>
			tabs.map(
				(tab) =>
					currentPath === tab.to ||
					(tab.to !== "/" && currentPath.startsWith(tab.to)),
			),
		[currentPath],
	);

	return (
		<nav
			aria-label="Main navigation"
			className="fixed bottom-6 left-1/2 z-50 pointer-events-none -translate-x-1/2"
		>
			<motion.div
				initial={{ y: 40, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{
					y: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
					opacity: { duration: 0.25, ease: "easeOut" },
					delay: 0.1,
				}}
				className="
					pointer-events-auto
					flex items-center p-1.5
					rounded-full
					bg-white/70 dark:bg-neutral-900/70
					backdrop-blur-md
					border border-black/5 dark:border-white/10
					shadow-2xl shadow-black/10 dark:shadow-black/40
				"
			>
				{tabs.map((tab, i) => (
					<NavTab key={tab.to} tab={tab} isActive={activeStates[i]} />
				))}
			</motion.div>
		</nav>
	);
}
