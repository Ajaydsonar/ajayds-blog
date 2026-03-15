// src/components/layout/ThemeToggle.tsx
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark" | "auto";

function getInitialMode(): ThemeMode {
	if (typeof window === "undefined") return "auto";
	const stored = window.localStorage.getItem("theme");
	if (stored === "light" || stored === "dark" || stored === "auto")
		return stored;
	return "auto";
}

function applyThemeMode(mode: ThemeMode) {
	const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
	const resolved = mode === "auto" ? (prefersDark ? "dark" : "light") : mode;
	const root = document.documentElement;

	root.classList.remove("light", "dark");
	root.classList.add(resolved);
	root.style.colorScheme = resolved;

	if (mode === "auto") {
		root.removeAttribute("data-theme");
	} else {
		root.setAttribute("data-theme", mode);
	}
}

// Wraps the theme swap in a native View Transition
// so the browser animates between old and new screenshots
function applyThemeWithTransition(mode: ThemeMode) {
	if (!document.startViewTransition) {
		// Fallback for browsers that don't support it yet (Firefox < 126)
		applyThemeMode(mode);
		return;
	}

	document.startViewTransition(() => {
		applyThemeMode(mode);
	});
}

function SunIcon() {
	return (
		<svg
			width="15"
			height="15"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="4" />
			<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
		</svg>
	);
}

function MoonIcon() {
	return (
		<svg
			width="15"
			height="15"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
		</svg>
	);
}

function AutoIcon() {
	return (
		<svg
			width="15"
			height="15"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="9" />
			<path d="M12 3v9l4 2" />
		</svg>
	);
}

const icons = { light: <SunIcon />, dark: <MoonIcon />, auto: <AutoIcon /> };
const labels = { light: "Light", dark: "Dark", auto: "Auto" };
const nextMode: Record<ThemeMode, ThemeMode> = {
	auto: "light",
	light: "dark",
	dark: "auto",
};

export default function ThemeToggle() {
	const [mode, setMode] = useState<ThemeMode>("auto");
	const [direction] = useState(1);

	useEffect(() => {
		const initial = getInitialMode();
		setMode(initial);
		applyThemeMode(initial); // no transition on first load
	}, []);

	useEffect(() => {
		if (mode !== "auto") return;
		const media = window.matchMedia("(prefers-color-scheme: dark)");
		const onChange = () => applyThemeWithTransition("auto");
		media.addEventListener("change", onChange);
		return () => media.removeEventListener("change", onChange);
	}, [mode]);

	function toggle() {
		const next = nextMode[mode];
		setMode(next);
		applyThemeWithTransition(next); // ← burst happens here
		window.localStorage.setItem("theme", next);
	}

	return (
		<button
			type="button"
			onClick={toggle}
			aria-label={`Theme: ${mode}. Click to cycle.`}
			title={`Theme: ${mode}. Click to cycle.`}
			className="relative flex items-center gap-1.5 overflow-hidden rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1.5 text-[var(--sea-ink)] shadow-[0_8px_22px_rgba(30,90,72,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_26px_rgba(30,90,72,0.13)]"
		>
			<span className="relative flex h-4 w-4 items-center justify-center">
				<AnimatePresence mode="wait" initial={false}>
					<motion.span
						key={mode}
						initial={{ opacity: 0, y: 8 * direction, scale: 0.7 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: -8 * direction, scale: 0.7 }}
						transition={{ duration: 0.18, ease: [0.32, 0.72, 0, 1] }}
						className="absolute inset-0 flex items-center justify-center"
					>
						{icons[mode]}
					</motion.span>
				</AnimatePresence>
			</span>

			<span className="relative flex h-4 w-9 items-center overflow-hidden text-xs font-semibold">
				<AnimatePresence mode="wait" initial={false}>
					<motion.span
						key={mode}
						initial={{ opacity: 0, y: 8 * direction }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -8 * direction }}
						transition={{ duration: 0.18, ease: [0.32, 0.72, 0, 1] }}
						className="absolute"
					>
						{labels[mode]}
					</motion.span>
				</AnimatePresence>
			</span>
		</button>
	);
}
