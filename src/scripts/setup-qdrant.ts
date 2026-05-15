import { QdrantClient } from "@qdrant/js-client-rest";
import { ajaydsInfo } from "./ajaydsInfo";

const client = new QdrantClient({
	url: process.env.QDRANT_URL,
	apiKey: process.env.QDRANT_API_KEY,
});

try {
	await client.createCollection("ajayds_info", {
		vectors: { size: 384, distance: "Cosine" },
	});

	const res = await client.getCollections();
	console.log(res.collections);

	const points: any[] = [];
	let idx = 0;

	for (const item of ajaydsInfo) {
		points.push({
			id: idx, // Using integer for the Vector DB point ID
			vector: {
				// Embedding the main content
				text: item.text,
				model: "sentence-transformers/all-MiniLM-L6-v2",
			},
			payload: {
				// Storing all your structured data as metadata
				string_id: item.id,
				text: item.text, // Keep the text in payload if you want to retrieve it later
				section: item.section,
				url: item.url,
			},
		});
		idx++;
	}

	// Upsert points to your new collection (e.g., "portfolio")
	await client.upsert("ajayds_info", { points });
	// await client.deleteCollection("ajayds_info");
	console.log("done!");
} catch (error: any) {
	console.log("error : ", error.message);
}
