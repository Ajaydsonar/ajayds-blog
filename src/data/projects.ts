export type Project = {
	id: string;
	title: string;
	description: string;
	longDescription: string;
	stack: string[];
	liveUrl: string;
	screenshots: string[];
	serviceIds: string[];
};

export const projects: Project[] = [
	{
		id: "sellerpilot",
		title: "SellerPilot",
		description:
			"AI-powered seller dashboard unifying Amazon, Shopify, and Etsy into one view.",
		longDescription:
			"An all-in-one dashboard for e-commerce sellers juggling multiple channels. Pulls inventory, sales, and reviews from Amazon, Shopify, and Etsy into a single Next.js interface. AI flags low-stock items, surfaces negative reviews instantly, and highlights pricing gaps against competitors. Solves the problem of stitching together 5 spreadsheets every morning.",
		stack: [
			"Next.js",
			"Python",
			"FastAPI",
			"PostgreSQL",
			"Amazon SP-API",
			"Recharts",
		],
		liveUrl: "#",
		screenshots: ["/projects/saas-1.png", "/projects/saas-2.png"],
		serviceIds: ["ai-webapps-mvp", "ai-data-pipelines"],
	},
	{
		id: "leadloop",
		title: "LeadLoop",
		description:
			"AI lead nurturing that scores, follows up, and reminds agents to close.",
		longDescription:
			"Built for real estate agents who lose 80% of leads to slow follow-up. Leads come in from any source, get scored by AI based on likelihood to close, and receive personalized follow-up sequences via email and SMS. Hot leads trigger a call reminder to the agent. Recovers 3+ hours/day that agents spend on manual lead management.",
		stack: [
			"Next.js",
			"Node.js",
			"OpenAI",
			"Twilio",
			"MongoDB",
			"Tailwind CSS",
		],
		liveUrl: "#",
		screenshots: ["/projects/saas-1.png", "/projects/saas-2.png"],
		serviceIds: ["ai-webapps-mvp"],
	},
	{
		id: "nocalllost",
		title: "NoCallLost",
		description:
			"AI answering service that books jobs 24/7 for home service businesses.",
		longDescription:
			"A voice AI that answers the phone when tradespeople can't — on a job, after hours, or on weekends. Books appointments directly into Google Calendar, sends SMS confirmation to the customer, and alerts the owner via WhatsApp if a human is needed. One missed call for an HVAC or plumbing business is $200-$500 lost. This pays for itself on the first call.",
		stack: [
			"Python",
			"Twilio Voice",
			"n8n",
			"Google Calendar API",
			"OpenAI Whisper",
			"WhatsApp API",
		],
		liveUrl: "#",
		screenshots: ["/projects/saas-1.png", "/projects/saas-2.png"],
		serviceIds: ["ai-workflow-automation"],
	},
	{
		id: "reviewguard",
		title: "ReviewGuard",
		description:
			"Automated review monitoring and response system for e-commerce sellers.",
		longDescription:
			"Monitors Amazon and Shopify reviews in real-time. Instant alerts on negative reviews with AI-generated response drafts ready to post. Pattern detection flags recurring product issues before they become viral. One bad review can kill a $50k/month listing — this catches problems in minutes, not days.",
		stack: [
			"Python",
			"n8n",
			"Amazon SP-API",
			"Shopify API",
			"OpenAI",
			"Slack API",
		],
		liveUrl: "#",
		screenshots: ["/projects/saas-1.png", "/projects/saas-2.png"],
		serviceIds: ["ai-workflow-automation"],
	},
	{
		id: "marginmonster",
		title: "MarginMonster",
		description:
			"Profit intelligence dashboard showing true per-product margins across channels.",
		longDescription:
			"Most e-commerce sellers think they're profitable but can't tell you which products actually make money. MarginMonster pulls from Amazon, Shopify, and Etsy, calculates true profit per product after FBA fees, shipping, PPC spend, and refunds — then shows exactly which products to double down on and which to kill.",
		stack: [
			"Next.js",
			"Python",
			"Amazon SP-API",
			"Shopify API",
			"PostgreSQL",
			"Recharts",
		],
		liveUrl: "#",
		screenshots: ["/projects/saas-1.png", "/projects/saas-2.png"],
		serviceIds: ["ai-data-pipelines"],
	},
	{
		id: "revenueradar",
		title: "RevenueRadar",
		description:
			"Financial dashboard giving tradespeople visibility into their business.",
		longDescription:
			"Connects to Stripe and QuickBooks to show revenue by job type, crew, month, and customer. Includes cash flow forecasting and expense breakdowns by category. Most tradespeople price jobs blind with zero financial visibility — this dashboard shows them their whole business in one screen.",
		stack: [
			"Next.js",
			"Python",
			"Stripe API",
			"QuickBooks API",
			"PostgreSQL",
			"Recharts",
		],
		liveUrl: "#",
		screenshots: ["/projects/saas-1.png", "/projects/saas-2.png"],
		serviceIds: ["ai-data-pipelines"],
	},
];

export function getProject(id: string): Project | undefined {
	return projects.find((p) => p.id === id);
}

export function getProjectsByIds(ids: string[]): Project[] {
	return projects.filter((p) => ids.includes(p.id));
}
