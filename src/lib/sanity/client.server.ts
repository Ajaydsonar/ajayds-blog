import { createClient } from "@sanity/client";

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET ?? "production";
const apiVersion = process.env.SANITY_API_VERSION ?? "2026-05-30";

if (!projectId) {
	throw new Error("Missing SANITY_PROJECT_ID environment variable");
}

export const sanityClient = createClient({
	projectId,
	dataset,
	apiVersion,
	useCdn: true,
});
