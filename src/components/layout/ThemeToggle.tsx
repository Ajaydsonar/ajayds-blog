// src/components/layout/ThemeToggle.tsx
import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

function getInitialMode(): ThemeMode {
	if (typeof window === "undefined") return "light";

	const stored = window.localStorage.getItem("theme");

	if (stored === "light" || stored === "dark") {
		return stored;
	}

	return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function applyThemeMode(mode: ThemeMode) {
	const root = document.documentElement;

	root.classList.remove("light", "dark");
	root.classList.add(mode);
	root.setAttribute("data-theme", mode);
	root.style.colorScheme = mode;
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

const labels: Record<ThemeMode, string> = {
	light: "Light",
	dark: "Dark",
};

export default function ThemeToggle() {
	const [mounted, setMounted] = useState(false);
	const [mode, setMode] = useState<ThemeMode>("light");

	useEffect(() => {
		const initialMode = getInitialMode();

		setMode(initialMode);
		applyThemeMode(initialMode);
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!mounted) return;

		applyThemeMode(mode);
		window.localStorage.setItem("theme", mode);
	}, [mode, mounted]);

	function toggle() {
		setMode((current) => (current === "light" ? "dark" : "light"));
	}

	const nextMode = mode === "light" ? "dark" : "light";

	if (!mounted) {
		return (
			<button
				type="button"
				aria-label="Toggle theme"
				title="Toggle theme"
				className="relative flex items-center gap-1.5 overflow-hidden rounded-full border border-(--chip-line) bg-(--chip-bg) px-3 py-1.5 text-(--sea-ink) shadow-[0_8px_22px_rgba(30,90,72,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_26px_rgba(30,90,72,0.13)]"
			>
				<span className="relative flex h-4 w-4 items-center justify-center opacity-0">
					<SunIcon />
				</span>

				<span className="relative flex h-4 w-9 items-center overflow-hidden text-xs font-semibold opacity-0">
					Light
				</span>
			</button>
		);
	}

	return (
		<button
			type="button"
			onClick={toggle}
			aria-label={`Theme: ${mode}. Click to switch to ${nextMode}.`}
			title={`Theme: ${mode}. Click to switch to ${nextMode}.`}
			className="relative flex items-center gap-1.5 overflow-hidden rounded-full border border-(--chip-line) bg-(--chip-bg) px-3 py-1.5 text-(--sea-ink) shadow-[0_8px_22px_rgba(30,90,72,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_26px_rgba(30,90,72,0.13)]"
		>
			<span className="relative flex h-4 w-4 items-center justify-center">
				<span
					className={[
						"absolute inset-0 flex items-center justify-center transition duration-200 ease-out",
						mode === "light"
							? "translate-y-0 scale-100 opacity-100"
							: "-translate-y-1 scale-75 opacity-0",
					].join(" ")}
				>
					<SunIcon />
				</span>

				<span
					className={[
						"absolute inset-0 flex items-center justify-center transition duration-200 ease-out",
						mode === "dark"
							? "translate-y-0 scale-100 opacity-100"
							: "translate-y-1 scale-75 opacity-0",
					].join(" ")}
				>
					<MoonIcon />
				</span>
			</span>

			<span className="relative flex h-4 w-9 items-center overflow-hidden text-xs font-semibold">
				<span
					className={[
						"absolute transition duration-200 ease-out",
						mode === "light"
							? "translate-y-0 opacity-100"
							: "-translate-y-2 opacity-0",
					].join(" ")}
				>
					{labels.light}
				</span>

				<span
					className={[
						"absolute transition duration-200 ease-out",
						mode === "dark"
							? "translate-y-0 opacity-100"
							: "translate-y-2 opacity-0",
					].join(" ")}
				>
					{labels.dark}
				</span>
			</span>
		</button>
	);
}
