import { json, type RequestHandler } from '@sveltejs/kit';
import { handler } from '$lib/server/problem.ts';
import { loadFeed, popularTags } from '$lib/server/feed.ts';

export const GET: RequestHandler = async (event) =>
	handler(async () => {
		const url = event.url;
		const sort = url.searchParams.get('sort') === 'populer' ? 'populer' : 'terbaru';
		const feed = await loadFeed({
			cursor: url.searchParams.get('cursor') ?? undefined,
			tag: url.searchParams.get('tag') ?? undefined,
			sort
		});
		return json({ ...feed, tags: await popularTags() }, {
			headers: { 'cache-control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300' }
		});
	});
