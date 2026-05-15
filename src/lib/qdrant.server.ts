import { QdrantClient } from "@qdrant/js-client-rest";

export const qdrant = new QdrantClient({
	url: process.env.QDRANT_URL,
	apiKey: process.env.QDRANT_API_KEY,
});

export async function searchWebsiteKnowledge(query: string) {
	return await qdrant.query("ajayds_info", {
		query: {
			text: query,
			model: "sentence-transformers/all-MiniLM-L6-v2",
		},
		limit: 5,
		with_payload: true,
	});
}
