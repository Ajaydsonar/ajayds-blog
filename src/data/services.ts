export type Service = {
	id: string;
	title: string;
	tagline: string;
	description: string;
	deliverables: string[];
	process: {
		step: number;
		title: string;
		description: string;
	}[];
	relatedProjectIds: string[];
};

export const services: Service[] = [
	{
		id: "ai-webapps-mvp",
		title: "AI-Powered Web Apps & MVPs",
		tagline: "Ship your vision, not just your code.",
		description:
			"I build AI-powered web apps and production-ready MVPs for solo founders and startups. From Next.js frontends to Python backends, I handle the full stack — with AI features baked in from day one, not bolted on later.",
		deliverables: [
			"Responsive frontend (React / Next.js)",
			"AI-powered features (OpenAI, Claude, custom models)",
			"Backend API (Node.js / Python FastAPI)",
			"Database design & setup (PostgreSQL / MongoDB)",
			"Auth, billing, and user management",
			"Deployment on Vercel, Railway, or your infra",
		],
		process: [
			{
				step: 1,
				title: "Discovery call",
				description:
					"We talk through your idea, target users, and what AI capabilities you actually need. I cut through the hype and focus on what ships.",
			},
			{
				step: 2,
				title: "Scope & architecture",
				description:
					"I send a clear scope with deliverables, AI integration points, timeline, and price. No vague estimates, no surprises.",
			},
			{
				step: 3,
				title: "Build in sprints",
				description:
					"I build in 1-week sprints with a demo each week. You see a working product, not slide decks.",
			},
			{
				step: 4,
				title: "Launch & handoff",
				description:
					"We review together, I fix feedback, then deploy. You get source code, docs, and the keys to everything.",
			},
		],
		relatedProjectIds: ["sellerpilot", "leadloop"],
	},
	{
		id: "ai-workflow-automation",
		title: "AI Workflow Automation",
		tagline: "Stop doing the work your software should be doing.",
		description:
			"I automate repetitive business workflows using Python and n8n. If your team is copy-pasting between spreadsheets, manually following up with leads, or doing the same task every morning — I can automate it in days, not months.",
		deliverables: [
			"Custom Python automation scripts",
			"n8n workflow orchestration",
			"API integrations (CRMs, email, Slack, WhatsApp)",
			"AI-powered decision making in workflows",
			"Scheduled task automation (cron / webhooks)",
			"Error monitoring & alerting",
		],
		process: [
			{
				step: 1,
				title: "Map the workflow",
				description:
					"You show me what you do manually. I identify every step that can be automated and every edge case that can't.",
			},
			{
				step: 2,
				title: "Build the automation",
				description:
					"Fast iteration — most automations have a working version within 2-3 days. You see it run on your actual data.",
			},
			{
				step: 3,
				title: "Test on real workflows",
				description:
					"We run it alongside your manual process for a few days. It doesn't replace your workflow until it's proven.",
			},
			{
				step: 4,
				title: "Deploy & monitor",
				description:
					"I set it up to run on schedule with error alerts. If anything breaks, you know before your customers do.",
			},
		],
		relatedProjectIds: ["nocalllost", "reviewguard"],
	},
	{
		id: "ai-data-pipelines",
		title: "AI Data Pipelines & Dashboards",
		tagline: "Your next big move is already in your data.",
		description:
			"I build data pipelines that scrape, clean, and transform raw data into actionable dashboards. Whether it's competitor pricing, market intel, or internal metrics — I turn scattered data into your competitive advantage.",
		deliverables: [
			"Web scraping & data extraction (Scrapy / Playwright)",
			"ETL pipelines (Python / Pandas)",
			"Real-time or scheduled data processing",
			"Interactive dashboards (Next.js / Recharts)",
			"AI-powered insights & anomaly detection",
			"Automated reporting & alerts",
		],
		process: [
			{
				step: 1,
				title: "Audit your data sources",
				description:
					"We identify where your data lives, what you're doing with it manually, and what insights you're missing.",
			},
			{
				step: 2,
				title: "Build the pipeline",
				description:
					"I build the scraping, cleaning, and transformation layer. You see raw data flowing in within the first week.",
			},
			{
				step: 3,
				title: "Build the dashboard",
				description:
					"Interactive dashboard with the metrics that matter. Not 50 charts — the 5 that help you make decisions.",
			},
			{
				step: 4,
				title: "Automate & hand off",
				description:
					"Pipelines run on schedule, dashboards auto-update, alerts fire when something needs your attention.",
			},
		],
		relatedProjectIds: ["marginmonster", "revenueradar"],
	},
];

export function getService(id: string): Service | undefined {
	return services.find((s) => s.id === id);
}
