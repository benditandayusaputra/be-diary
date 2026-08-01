<script lang="ts">
	import KartuFeed from '$components/publik/KartuFeed.svelte';
	import { i18n } from '$lib/state/i18n.svelte.ts';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const filter = $derived([
		{ label: i18n.t.publik.terbaru, href: '/read', aktif: data.sort === 'terbaru' && !data.tagAktif },
		{
			label: i18n.t.publik.populer,
			href: '/read?sort=populer',
			aktif: data.sort === 'populer' && !data.tagAktif
		},
		...data.tags.slice(0, 6).map((t) => ({
			label: t,
			href: `/read?tag=${encodeURIComponent(t)}`,
			aktif: data.tagAktif === t
		}))
	]);
</script>

<svelte:head>
	<title>Feed publik · be-diary</title>
	<meta
		name="description"
		content="Tulisan harian yang sengaja dikeluarkan dari enkripsi oleh penulisnya."
	/>
</svelte:head>

<div
	class="meja-kayu"
	style="padding:var(--s-7) var(--s-6) var(--s-8);display:flex;flex-direction:column;gap:var(--s-6)"
>
	<header
		style="display:flex;flex-wrap:wrap;gap:var(--s-4);align-items:flex-end;justify-content:space-between"
	>
		<div style="display:flex;flex-direction:column;gap:8px">
			<h1 class="t-judul t-xl" style="color:#E8DFC9;line-height:1">{i18n.t.publik.feedJudul}</h1>
			<p
				style="margin:0;font-family:var(--f-read);font-size:var(--text-md);line-height:1.6;color:#BFAF92;max-width:56ch;text-wrap:pretty"
			>
				{i18n.t.publik.feedSub}
			</p>
		</div>

		<div style="display:flex;flex-wrap:wrap;gap:8px">
			{#each filter as f (f.href)}
				<a
					href={f.href}
					class="tbl-papan {f.aktif ? 'tbl-papan-aktif' : ''}"
					style="min-height:38px;text-decoration:none">{f.label}</a
				>
			{/each}
		</div>
	</header>

	{#if data.items.length === 0}
		<p style="font-family:var(--f-read);color:#BFAF92">{i18n.t.umum.tidakAda}</p>
	{:else}
		<div style="columns:auto 320px;column-gap:var(--s-5)">
			{#each data.items as item (item.id)}
				<div style="break-inside:avoid;margin-bottom:var(--s-5)">
					<KartuFeed {item} />
				</div>
			{/each}
		</div>
	{/if}

	{#if data.nextCursor}
		<a
			href="/read?cursor={encodeURIComponent(data.nextCursor)}{data.tagAktif
				? `&tag=${encodeURIComponent(data.tagAktif)}`
				: ''}"
			class="tbl-papan"
			style="align-self:center;text-decoration:none">Lebih lama</a
		>
	{/if}
</div>
