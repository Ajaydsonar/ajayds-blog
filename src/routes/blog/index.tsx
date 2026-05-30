import { createFileRoute, Link } from "@tanstack/react-router";
import { getPosts } from "#/lib/sanity/posts.action.ts";

export const Route = createFileRoute("/blog/")({
	loader: async () => {
		return getPosts();
	},
	head: () => ({
		meta: [
			{ title: "Blog | Your Site Name" },
			{
				name: "description",
				content:
					"Read practical guides, tutorials, and insights from Your Site Name.",
			},
			{
				name: "robots",
				content: "index,follow,max-image-preview:large",
			},
			{ property: "og:title", content: "Blog | Your Site Name" },
			{
				property: "og:description",
				content:
					"Read practical guides, tutorials, and insights from Your Site Name.",
			},
			{ property: "og:type", content: "website" },
		],
		links: [
			{
				rel: "canonical",
				href: `${process.env.SITE_URL}/blog`,
			},
		],
	}),
	component: BlogIndexPage,
});

function BlogIndexPage() {
	const posts = Route.useLoaderData();

	return (
		<main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
			<header className="mb-12 max-w-3xl">
				<p className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
					Blog
				</p>
				<h1 className="text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl">
					Latest articles
				</h1>
				<p className="mt-4 text-lg leading-8 text-zinc-600">
					Practical posts, guides, and insights.
				</p>
			</header>

			<section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
				{posts.map((post) => {
					const imageUrl = post.coverImage?.url;

					return (
						<article
							key={post._id}
							className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
						>
							<Link
								to="/blog/$slug"
								params={{ slug: post.slug || "" }}
								className="block"
							>
								{imageUrl ? (
									<img
										src={imageUrl}
										alt={post.coverImage?.alt || post.title || ""}
										width={post.coverImage?.dimensions?.width || 1200}
										height={post.coverImage?.dimensions?.height || 675}
										loading="lazy"
										className="aspect-video w-full object-cover"
									/>
								) : null}

								<div className="p-6">
									<time
										dateTime={post.publishedAt || ""}
										className="text-sm text-zinc-500"
									>
										{new Date(post.publishedAt || "").toLocaleDateString(
											"en-IN",
											{
												day: "numeric",
												month: "long",
												year: "numeric",
											},
										)}
									</time>

									<h2 className="mt-3 text-xl font-semibold leading-7 text-zinc-950">
										{post.title}
									</h2>

									<p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-600">
										{post.excerpt || post.description}
									</p>

									<p className="mt-5 text-sm font-medium text-zinc-950">
										Read article →
									</p>
								</div>
							</Link>
						</article>
					);
				})}
			</section>
		</main>
	);
}

// function RouteComponent() {
// 	const [content, setContent] = useState("");
// 	const [isAnswering, setIsAnswering] = useState(false);
// 	const outputdivRef = useRef<HTMLDivElement>(null);

// 	const handleAI = async () => {
// 		if (!content.trim()) return;
// 		setIsAnswering(true);
// 		setContent("");
// 		if (outputdivRef.current) {
// 			outputdivRef.current.textContent = "answering...";
// 		}

// 		// if (!response.ok) {
// 		// 	throw new Error(data.error || "Chat request failed");
// 		// }
// 		try {
// 			const data = await chatMessage({ data: { message: content } });

// 			if (outputdivRef.current) {
// 				outputdivRef.current.textContent = data.answer || "";
// 			}
// 			console.log("using server fn");
// 		} catch (error: any) {
// 			console.log("error : ", error.message);
// 		}

// 		setIsAnswering(false);
// 	};
// 	return (
// 		<div className="flex flex-col">
// 			<div className="w-100 h-100 my-4 mx-auto border" ref={outputdivRef}></div>
// 			<div className="mx-auto">
// 				<input
// 					value={content}
// 					onChange={(e) => setContent(e.target.value)}
// 					type="text"
// 					placeholder="enter query"
// 					className="outline-blue-300  px-2 py-1 "
// 				/>
// 				<button
// 					disabled={isAnswering || !content.trim()}
// 					onClick={handleAI}
// 					type="button"
// 					className="m-4 text-blue-500 px-2 py-1 border border-blue-300"
// 				>
// 					launch
// 				</button>
// 			</div>
// 		</div>
// 	);
// }
