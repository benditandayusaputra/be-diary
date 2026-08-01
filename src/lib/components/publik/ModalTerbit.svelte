<script lang="ts">
	import Tirai from '$components/dasar/Tirai.svelte';
	import type { LocalEntry } from '$lib/db/local/types.ts';
	import { publishApi } from '$lib/api/endpoints.ts';
	import { sesi } from '$lib/state/sesi.svelte.ts';
	import { toast } from '$lib/state/toast.svelte.ts';
	import { i18n } from '$lib/state/i18n.svelte.ts';
	import { stempelTanggal } from '$lib/utils/tanggal.ts';
	import { plainRingkas } from '$lib/utils/teks.ts';

	interface Props {
		terbuka: boolean;
		entri: LocalEntry;
		ontutup: () => void;
		onterbit: (publicId: string) => void | Promise<void>;
	}

	let { terbuka, entri, ontutup, onterbit }: Props = $props();

	let setuju = $state(false);
	let anonim = $state(false);
	let sibuk = $state(false);

	const judul = $derived(entri.title.trim() || plainRingkas(entri.body, 60) || 'Tanpa judul');
	const namaTampil = $derived(anonim ? i18n.t.publik.anonim : (sesi.penName ?? 'nama pena belum diisi'));
	const bisa = $derived(setuju && !sibuk && entri.body.trim().length > 0);

	async function terbitkan() {
		if (!bisa) return;
		sibuk = true;
		try {
			const res = await publishApi.create({
				sourceEntryId: entri.id,
				title: judul,
				bodyMd: entri.body,
				entryDate: entri.entryDate,
				mood: entri.mood,
				tags: entri.tags,
				isAnonymous: anonim,
				visibility: 'public',
				consent: true
			});
			await onterbit(res.id);
			toast.show(
				res.moderationState === 'pending'
					? 'Terbit. Akun baru masuk antrean tinjau sebelum muncul di feed.'
					: 'Terbit ke halaman publik.'
			);
		} catch (err) {
			toast.bahaya((err as Error).message);
		} finally {
			sibuk = false;
		}
	}
</script>

<Tirai {terbuka} label={i18n.t.publik.modalJudul} {ontutup}>
	<div
		style="max-width:1000px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:var(--s-5);align-items:start"
	>
		<div
			class="kertas kertas-angkat"
			style="padding:var(--s-6);display:flex;flex-direction:column;gap:var(--s-5)"
		>
			<h2 class="t-judul t-xl" style="color:var(--ink)">{i18n.t.publik.modalJudul}</h2>
			<p class="t-baca" style="max-width:62ch">{i18n.t.publik.modalPeringatan}</p>

			<div
				style="display:flex;flex-direction:column;gap:var(--s-3);padding:var(--s-4) 0;border-top:1px solid rgb(27 27 23 / 0.16);border-bottom:1px solid rgb(27 27 23 / 0.16)"
			>
				<span class="t-data t-data-ink">{i18n.t.publik.tampilkanSebagai}</span>
				<label style="display:flex;align-items:center;gap:11px;min-height:44px;cursor:pointer">
					<input
						type="radio"
						name="penulis"
						checked={!anonim}
						style="width:18px;height:18px;accent-color:#2B4F8E"
						onchange={() => (anonim = false)}
					/>
					<span style="font-family:var(--f-read);font-size:var(--text-md);color:var(--ink)">
						{sesi.penName ?? 'Isi nama pena dulu di Pengaturan'}
					</span>
				</label>
				<label style="display:flex;align-items:center;gap:11px;min-height:44px;cursor:pointer">
					<input
						type="radio"
						name="penulis"
						checked={anonim}
						style="width:18px;height:18px;accent-color:#2B4F8E"
						onchange={() => (anonim = true)}
					/>
					<span style="font-family:var(--f-read);font-size:var(--text-md);color:var(--ink)"
						>{i18n.t.publik.anonim}</span
					>
				</label>
			</div>

			<label style="display:flex;align-items:flex-start;gap:11px;min-height:44px;cursor:pointer">
				<input
					type="checkbox"
					bind:checked={setuju}
					style="width:20px;height:20px;margin-top:3px;accent-color:#2B4F8E"
				/>
				<span
					style="font-family:var(--f-read);font-size:var(--text-md);line-height:1.6;color:var(--ink)"
					>{i18n.t.publik.modalSetuju}</span
				>
			</label>

			<div style="display:flex;gap:var(--s-3);flex-wrap:wrap">
				<button type="button" class="tbl" disabled={!bisa} onclick={terbitkan}>
					{sibuk ? i18n.t.umum.memuat : 'Terbitkan'}
				</button>
				<button type="button" class="tbl-garis" onclick={ontutup}>{i18n.t.app.batal}</button>
			</div>
		</div>

		<div style="display:flex;flex-direction:column;gap:10px">
			<span class="t-data">{i18n.t.publik.pratinjau}</span>
			<div
				class="kertas kertas-buram"
				style="padding:var(--s-5);transform:rotate(-1.2deg);display:flex;flex-direction:column;gap:10px"
			>
				<span class="t-data t-data-ink"
					>{namaTampil} · {stempelTanggal(entri.entryDate, i18n.locale)}</span
				>
				<h3 class="t-judul" style="color:var(--ink);font-size:var(--text-lg)">{judul}</h3>
				<p class="t-baca" style="color:var(--ink-soft)">{plainRingkas(entri.body, 240)}</p>
			</div>
		</div>
	</div>
</Tirai>
