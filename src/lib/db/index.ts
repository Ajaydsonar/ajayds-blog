// import { neon } from "@neondatabase/serverless";
import { Redis } from "@upstash/redis";
// import { drizzle } from "drizzle-orm/neon-http";

export const redis = new Redis({
	token: process.env.UPSTASH_REDIS_REST_TOKEN,
	url: process.env.UPSTASH_REDIS_REST_URL,
});

// const sql = neon(process.env.PSQL_DATABASE_URL!);
// export const db = drizzle({ client: sql });
