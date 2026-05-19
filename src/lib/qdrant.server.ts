import { QdrantClient } from "@qdrant/js-client-rest";

export const qdrant = new QdrantClient({
	url: process.env.QDRANT_URL,
	apiKey: process.env.QDRANT_API_KEY,
});

export async function searchWebsiteKnowledge(query: string) {
	const results = await qdrant.query("ajayds_info", {
		query: {
			text: query,
			model: "sentence-transformers/all-MiniLM-L6-v2",
		},
		limit: 5,
		with_payload: true,
	});

	const context = results.points
		.map((chunk: any) => chunk.text || JSON.stringify(chunk))
		.join("\n\n");

	return context;
}

// searchWebsiteKnowledge("what services you guys provide?")
// 	.then((data) => {
// 		data.points.forEach((v) => {
// 			console.dir(v);
// 		});
// 	})
// 	.catch((e) => console.error(e));
