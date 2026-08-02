<script lang="ts">
	import Kertas from '$components/dasar/Kertas.svelte';
	import { PAPERS, PIN_GRADIENT } from '$lib/utils/kertas.ts';
	import { TAUTAN_TRAKTIR } from '$lib/utils/tautan.ts';

	const contoh = [
		{ hari: 16, mood: 5, teks: 'Hari ini aku tidak menghindar dari satu pun percakapan.', rot: -2.4 },
		{ hari: 19, mood: 4, teks: 'Beli kembang sepatu di depan pasar.', rot: 1.8 },
		{ hari: 22, mood: 3, teks: 'Minggu. Tidur siang dua jam, bangun bingung ini hari apa.', rot: -1.2 }
	];

	const janji = [
		{
			judul: 'Kami pun tidak bisa membacanya',
			isi: 'Tulisanmu dikunci di ponsel atau laptopmu dulu, baru dikirim. Yang kami terima sudah jadi huruf acak, dan kuncinya tidak pernah ikut dikirim.'
		},
		{
			judul: 'Jalan terus walau tidak ada sinyal',
			isi: 'Menulis, membaca, mengubah, mencari, ganti tampilan — semuanya tetap bisa walau sedang tidak ada internet. Begitu tersambung lagi, tulisanmu menyusul sendiri.'
		},
		{
			judul: 'Gratis dan terbuka',
			isi: 'Tidak ada iklan, tidak ada langganan, tidak ada data yang dijual. Kodenya boleh dilihat dan dipakai siapa saja, bahkan dijalankan di komputermu sendiri.'
		},
		{
			judul: '24 kata cadangan',
			isi: 'Kalau sandimu lupa, 24 kata ini satu-satunya jalan balik. Kami sengaja tidak menyimpan salinannya — kalau kami punya, kami juga jadi bisa membuka diary-mu.'
		}
	];
</script>

<svelte:head>
	<title>be-diary · diary harian yang isinya cuma kamu yang bisa baca</title>
	<meta
		name="description"
		content="Diary harian yang dikunci di perangkatmu sendiri, jadi tidak ada orang lain yang bisa membacanya. Kartu kertas ditancap paku pin di papan flanel, dan tetap jalan walau tidak ada sinyal."
	/>
</svelte:head>

<section
	style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:var(--s-8);align-items:center;padding:var(--s-6) 0 var(--s-8)"
>
	<div style="display:flex;flex-direction:column;gap:var(--s-5)">
		<h1 class="t-judul" style="font-size:var(--text-2xl);line-height:1">
			Diary yang isinya<br />cuma kamu yang bisa baca
		</h1>
		<p
			style="margin:0;font-family:var(--f-read);font-size:var(--text-md);line-height:1.72;color:var(--ink-on-board-dim);max-width:52ch;text-wrap:pretty"
		>
			Tulisan harianmu dikunci di ponsel atau laptopmu dulu, baru dikirim. Sesampainya di tempat
			penyimpanan isinya sudah jadi huruf acak — kami yang membuat aplikasi ini pun tidak bisa membukanya.
			Bentuknya papan flanel dengan kartu kertas yang ditancap paku pin, bukan daftar yang kaku.
		</p>
		<div style="display:flex;gap:var(--s-3);flex-wrap:wrap">
			<a href="/daftar" class="tbl" style="text-decoration:none">Mulai menulis</a>
			<a href="/read" class="tbl-papan" style="text-decoration:none">Lihat tulisan publik</a>
		</div>
		<p
			style="margin:0;font-family:var(--f-read);font-size:var(--text-sm);color:var(--ink-on-board-dim);max-width:44ch"
		>
			Gratis dipakai, tanpa iklan, dan kodenya boleh kamu periksa sendiri.
		</p>
	</div>

	<div class="bingkai-kayu">
		<div class="papan-flanel" style="padding:34px">
			<ul
				style="margin:0;padding:0;list-style:none;display:flex;flex-wrap:wrap;gap:20px;justify-content:center"
			>
				{#each contoh as c, i (c.hari)}
					<li style="position:relative;width:150px">
						<span
							aria-hidden="true"
							class="pin-bulat"
							style="position:absolute;left:50%;top:-9px;z-index:4;transform:translateX(-50%);width:17px;height:17px;background:{PIN_GRADIENT[
								c.mood
							]}"
						></span>
						<div
							class="kartu-papan"
							style="--kertas:{PAPERS[i % 5]};transform:rotate({c.rot}deg);height:150px;cursor:default"
						>
							<span class="t-hand" style="font-size:2.2rem;line-height:0.82">{c.hari}</span>
							<p
								style="margin:0;font-family:var(--f-read);font-size:0.9rem;line-height:1.5;color:var(--ink-soft)"
							>
								{c.teks}
							</p>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</section>

<section style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:var(--s-5)">
	{#each janji as j, i (j.judul)}
		<Kertas warna={i % 2 === 0 ? 'bone' : 'buram'} rot={i % 2 === 0 ? -0.8 : 0.9} padding="var(--s-5)">
			<h2 class="t-judul" style="color:var(--ink);font-size:var(--text-md);margin-bottom:10px">
				{j.judul}
			</h2>
			<p class="t-baca" style="font-size:var(--text-sm);color:var(--ink-soft)">{j.isi}</p>
		</Kertas>
	{/each}
</section>

<section style="padding-top:var(--s-8);display:flex;flex-direction:column;gap:var(--s-4)">
	<h2 class="t-judul t-lg">Yang kami simpan, dan yang tidak pernah kami punya</h2>
	<Kertas warna="manila" padding="var(--s-5)">
		<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:var(--s-5)">
			<div>
				<span class="t-data t-data-ink">Yang kami simpan</span>
				<ul style="margin:8px 0 0;padding-left:1.1em;font-family:var(--f-read);color:var(--ink)">
					<li>Alamat emailmu</li>
					<li>Tanggal tulisan dan kapan terakhir diubah</li>
					<li>Berapa banyak tulisanmu, dan kira-kira sepanjang apa</li>
					<li>Perangkat apa saja yang kamu pakai</li>
				</ul>
			</div>
			<div>
				<span class="t-data t-data-ink">Yang tidak pernah kami punya</span>
				<ul style="margin:8px 0 0;padding-left:1.1em;font-family:var(--f-read);color:var(--ink)">
					<li>Isi tulisan dan judulnya</li>
					<li>Suasana hati dan nama label yang kamu pakai</li>
					<li>Isi foto atau berkas yang kamu lampirkan</li>
					<li>Sandi dan 24 kata cadanganmu</li>
				</ul>
			</div>
		</div>
		<p class="t-baca" style="font-size:var(--text-sm);color:var(--ink-soft);margin-top:var(--s-4)">
			Daftar lengkapnya ada di <a href="/privasi">halaman privasi</a>, ditulis apa adanya tanpa
			dibungkus bahasa hukum.
		</p>
	</Kertas>
</section>

<section style="padding-top:var(--s-8)">
	<Kertas warna="manila" rot={-0.6} padding="var(--s-6)">
		<div
			style="display:flex;flex-wrap:wrap;gap:var(--s-5);align-items:center;justify-content:space-between"
		>
			<div style="display:flex;flex-direction:column;gap:10px;max-width:52ch">
				<h2 class="t-judul t-lg" style="color:var(--ink)">Traktir kopi ☕</h2>
				<p class="t-baca" style="font-size:var(--text-sm);color:var(--ink-soft)">
					be-diary gratis dan tidak menaruh iklan di tulisanmu. Kalau aplikasi ini berguna buatmu
					dan kamu ingin ikut menjaganya tetap jalan, satu gelas kopi sudah sangat berarti.
					Tidak ditraktir pun aplikasinya tetap utuh, tanpa fitur yang dikunci.
				</p>
			</div>
			<a
				href={TAUTAN_TRAKTIR}
				target="_blank"
				rel="noopener noreferrer external"
				class="tbl"
				style="text-decoration:none;white-space:nowrap">Traktir lewat Saweria</a
			>
		</div>
	</Kertas>
</section>
