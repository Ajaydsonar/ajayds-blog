import { motion } from "motion/react";

interface ContactCTAProps {
	heading?: string;
	subtext?: string;
}

export function ContactCTA({
	heading = "Let's work together.",
	subtext = "Have a project in mind? Reach out and let's talk.",
}: ContactCTAProps) {
	return (
		<motion.section
			initial={{ opacity: 0, y: 24 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-40px" }}
			transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
			className="page-wrap mt-20 mb-32"
		>
			<div className="island-shell relative overflow-hidden rounded-2xl px-8 py-10 text-center sm:px-12">
				{/* Background orb */}
				<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
					<div className="h-64 w-64 rounded-full bg-var(--lagoon) opacity-10 blur-3xl" />
				</div>

				<div className="relative z-10">
					<p className="island-kicker mb-3">Available for new projects</p>
					<h2 className="display-title text-2xl font-bold text-var(--sea-ink) sm:text-3xl">
						{heading}
					</h2>
					<p className="mx-auto mt-3 max-w-md text-sm text-var(--sea-ink-soft)">
						{subtext}
					</p>

					{/* CTA buttons */}
					<div className="mt-8 flex flex-wrap items-center justify-center gap-3">
						{/* Email */}
						<motion.a
							href="mailto:ajay@ajayds.com"
							whileHover={{ scale: 1.03, y: -2 }}
							whileTap={{ scale: 0.97 }}
							transition={{ duration: 0.18 }}
							className="inline-flex items-center gap-2 rounded-xl border border-var(--chip-line) bg-var(--chip-bg) px-6 py-3 text-sm font-semibold text-var(--sea-ink) no-underline shadow-sm transition hover:shadow-md"
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
								<title>Email me</title>
								<rect width="20" height="16" x="2" y="4" rx="2" />
								<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
							</svg>
							Email me
						</motion.a>

						{/* WhatsApp */}
						<motion.a
							href="https://wa.me/91XXXXXXXXXX?text=Hi%20Ajay%2C%20I%20have%20a%20project%20I'd%20like%20to%20discuss."
							target="_blank"
							rel="noopener noreferrer"
							whileHover={{ scale: 1.03, y: -2 }}
							whileTap={{ scale: 0.97 }}
							transition={{ duration: 0.18 }}
							className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-semibold text-white no-underline shadow-sm transition hover:bg-[#20bd5a] hover:shadow-md"
						>
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="currentColor"
							>
								<title>Whatsapp me</title>
								<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
							</svg>
							WhatsApp
						</motion.a>
					</div>

					<p className="mt-4 text-xs text-var(--sea-ink-soft) opacity-60">
						Usually responds within 24 hours
					</p>
				</div>
			</div>
		</motion.section>
	);
}
