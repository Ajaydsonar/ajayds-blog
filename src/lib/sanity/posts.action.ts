import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { setResponseHeaders } from "@tanstack/react-start/server";
import { z } from "zod";
import type { POST_QUERY_RESULT, POSTS_QUERY_RESULT } from "#/sanity.types.ts";
import { sanityClient } from "./client.server";
import { POST_QUERY, POSTS_QUERY } from "./queries";

export const getPosts = createServerFn({ method: "GET" }).handler(
	async (): Promise<POSTS_QUERY_RESULT> => {
		setResponseHeaders(
			new Headers({
				"Cache-Control":
					"public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
			}),
		);

		return sanityClient.fetch<POSTS_QUERY_RESULT>(POSTS_QUERY);
	},
);

export const getPostBySlug = createServerFn({ method: "GET" })
	.inputValidator(
		z.object({
			slug: z.string().min(1),
		}),
	)
	.handler(async ({ data }): Promise<POST_QUERY_RESULT> => {
		const post = await sanityClient.fetch<POST_QUERY_RESULT>(POST_QUERY, {
			slug: data.slug,
		});

		if (!post) {
			throw notFound();
		}

		setResponseHeaders(
			new Headers({
				"Cache-Control":
					"public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
			}),
		);

		return post;
	});
