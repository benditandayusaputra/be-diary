import type { PageServerLoad } from './$types';
import { loadFeed, popularTags } from '$lib/server/feed.ts';

export const load: PageServerLoad = async ({ url, setHeaders }) => {
	const sort = url.searchParams.get('sort') === 'populer' ? 'populer' : 'terbaru';
	const tag = url.searchParams.get('tag') ?? undefined;

	const [feed, tags] = await Promise.all([
		loadFeed({ sort, tag, cursor: url.searchParams.get('cursor') ?? undefined }),
		popularTags()
	]);

	setHeaders({ 'cache-control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300' });
	return { ...feed, tags, sort, tagAktif: tag ?? null };
};
