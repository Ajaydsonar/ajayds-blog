import { QdrantClient } from "@qdrant/js-client-rest";
import fs from "fs";
import { ajaydsInfo } from "./ajaydsInfo";

type Chunk = {
	id: string;
	title: string;
	text: string;
	url: string;
	section: string;
	doc_type: string;
	service: string | null;
	tags: string[];
	intents: string[];
	priority: number;
	status: string;
	updated_at: string;
	source: string;
};

const client = new QdrantClient({
	url: process.env.QDRANT_URL,
	apiKey: process.env.QDRANT_API_KEY,
});

try {
	const lines = fs
		.readFileSync(
			"ajayds_rag_knowledgebase/data/knowledgebase_chunks.jsonl",
			"utf8",
		)
		.trim()
		.split(/\r?\n/);

	const chunks: Chunk[] = lines.map((line) => JSON.parse(line));
	// console.log(chunks[0]);

	await client.recreateCollection("ajayds_info", {
		vectors: { size: 384, distance: "Cosine" },
	});

	const res = await client.getCollections();
	console.log(res.collections);

	const points: any[] = [];
	let idx = 0;

	for (const item of chunks) {
		points.push({
			id: idx, // Using integer for the Vector DB point ID
			vector: {
				// Embedding the main content
				text: item.text,
				model: "sentence-transformers/all-MiniLM-L6-v2",
			},
			payload: item,
		});
		idx++;
	}

	// Upsert points to your new collection (e.g., "portfolio")
	await client.upsert("ajayds_info", { points });
	// // await client.deleteCollection("ajayds_info");
	console.log("done! " + points.length + " chunks inserted to qdrant");
} catch (error: any) {
	console.log("error : ", error.message);
}
