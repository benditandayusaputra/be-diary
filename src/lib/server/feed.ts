import { and, eq, desc, lt, sql, inArray } from 'drizzle-orm';
import { db, publicEntries, publicTags } from '$lib/db/server/index.ts';

export interface FeedItem {
	id: string;
	slug: string;
	title: string;
	excerpt: string;
	entryDate: string;
	mood: number | null;
	penName: string | null;
	isAnonymous: boolean;
	publishedAt: string;
	viewCount: number;
	reactionCount: number;
	tags: string[];
}

export interface FeedQuery {
	cursor?: string | undefined;
	sort?: 'terbaru' | 'populer';
	tag?: string | undefined;
	penName?: string | undefined;
	limit?: number;
}

export async function loadFeed(q: FeedQuery): Promise<{ items: FeedItem[]; nextCursor: string | null }> {
	const limit = Math.min(q.limit ?? 24, 50);
	const filters = [eq(publicEntries.visibility, 'public'), eq(publicEntries.moderationState, 'ok')];
	if (q.cursor) filters.push(lt(publicEntries.publishedAt, new Date(q.cursor)));
	if (q.penName) filters.push(eq(publicEntries.penName, q.penName));

	let ids: string[] | null = null;
	if (q.tag) {
		const tagged = await db
			.select({ id: publicTags.publicEntryId })
			.from(publicTags)
			.where(eq(publicTags.tag, q.tag.toLowerCase()))
			.limit(500);
		ids = tagged.map((t) => t.id);
		if (ids.length === 0) return { items: [], nextCursor: null };
		filters.push(inArray(publicEntries.id, ids));
	}

	const rows = await db
		.select()
		.from(publicEntries)
		.where(and(...filters))
		.orderBy(
			q.sort === 'populer' ? desc(publicEntries.viewCount) : desc(publicEntries.publishedAt)
		)
		.limit(limit + 1);

	const page = rows.slice(0, limit);
	const tagRows = page.length
		? await db
				.select()
				.from(publicTags)
				.where(inArray(publicTags.publicEntryId, page.map((r) => r.id)))
		: [];
	const byEntry = new Map<string, string[]>();
	for (const t of tagRows) {
		const list = byEntry.get(t.publicEntryId) ?? [];
		list.push(t.tag);
		byEntry.set(t.publicEntryId, list);
	}

	return {
		items: page.map((r) => ({
			id: r.id,
			slug: r.slug,
			title: r.title,
			excerpt: r.excerpt,
			entryDate: r.entryDate,
			mood: r.mood,
			penName: r.penName,
			isAnonymous: r.isAnonymous,
			publishedAt: r.publishedAt.toISOString(),
			viewCount: r.viewCount,
			reactionCount: r.reactionCount,
			tags: byEntry.get(r.id) ?? []
		})),
		nextCursor:
			rows.length > limit && page.length ? (page[page.length - 1] as (typeof page)[number]).publishedAt.toISOString() : null
	};
}

export async function popularTags(limit = 12): Promise<string[]> {
	const rows = await db
		.select({ tag: publicTags.tag, n: sql<number>`count(*)::int` })
		.from(publicTags)
		.groupBy(publicTags.tag)
		.orderBy(sql`count(*) desc`)
		.limit(limit);
	return rows.map((r) => r.tag);
}
