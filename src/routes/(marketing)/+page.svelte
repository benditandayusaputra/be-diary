<script lang="ts">
	import Kertas from '$components/dasar/Kertas.svelte';
	import { PAPERS, PIN_GRADIENT } from '$lib/utils/kertas.ts';

	const contoh = [
		{ hari: 16, mood: 5, teks: 'Hari ini aku tidak menghindar dari satu pun percakapan.', rot: -2.4 },
		{ hari: 19, mood: 4, teks: 'Beli kembang sepatu di depan pasar.', rot: 1.8 },
		{ hari: 22, mood: 3, teks: 'Minggu. Tidur siang dua jam, bangun bingung ini hari apa.', rot: -1.2 }
	];

	const janji = [
		{
			judul: 'Server tidak bisa membaca',
			isi: 'Enkripsi terjadi di perangkatmu dengan XChaCha20-Poly1305. Yang sampai ke server hanya ciphertext, nonce, dan kunci terbungkus.'
		},
		{
			judul: 'Jalan penuh tanpa jaringan',
			isi: 'Tulis, baca, sunting, cari, ganti tema — semuanya jalan offline. Sinkronisasi menyusul saat ada koneksi.'
		},
		{
			judul: 'Bisa dijalankan sendiri',
			isi: 'Kode AGPL-3.0. Ada docker-compose untuk self-host lengkap dengan Postgres, MinIO, dan Redis.'
		},
		{
			judul: '24 kata pemulihan',
			isi: 'Satu-satunya jalur balik kalau sandimu lupa. Kami tidak menyimpan salinannya, dan itu memang intinya.'
		}
	];
</script>

<svelte:head>
	<title>be-diary · diary harian yang tidak bisa dibaca servernya</title>
	<meta
		name="description"
		content="Aplikasi diary PWA dengan enkripsi ujung ke ujung. Kartu kertas ditancap paku pin di papan flanel, jalan penuh offline, bisa self-host."
	/>
</svelte:head>

<section
	style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:var(--s-8);align-items:center;padding:var(--s-6) 0 var(--s-8)"
>
	<div style="display:flex;flex-direction:column;gap:var(--s-5)">
		<h1 class="t-judul" style="font-size:var(--text-2xl);line-height:1">
			Diary yang servernya<br />tidak bisa membaca
		</h1>
		<p
			style="margin:0;font-family:var(--f-read);font-size:var(--text-md);line-height:1.72;color:var(--ink-on-board-dim);max-width:52ch;text-wrap:pretty"
		>
			Tulisan harianmu dienkripsi di perangkat sebelum keluar. Operator server, termasuk kami,
			secara teknis tidak bisa membukanya. Tampilannya papan flanel dengan kartu kertas yang
			ditancap paku pin, bukan tabel.
		</p>
		<div style="display:flex;gap:var(--s-3);flex-wrap:wrap">
			<a href="/daftar" class="tbl" style="text-decoration:none">Mulai menulis</a>
			<a href="/read" class="tbl-papan" style="text-decoration:none">Lihat tulisan publik</a>
		</div>
		<span class="t-data">Argon2id · XChaCha20-Poly1305 · BIP-39 · AGPL-3.0</span>
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
	<h2 class="t-judul t-lg">Apa yang tetap dilihat server</h2>
	<Kertas warna="manila" padding="var(--s-5)">
		<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:var(--s-5)">
			<div>
				<span class="t-data t-data-ink">Server tahu</span>
				<ul style="margin:8px 0 0;padding-left:1.1em;font-family:var(--f-read);color:var(--ink)">
					<li>Alamat email</li>
					<li>Tanggal entri dan waktu ubah</li>
					<li>Jumlah entri dan bucket ukuran</li>
					<li>Daftar perangkat</li>
				</ul>
			</div>
			<div>
				<span class="t-data t-data-ink">Server tidak tahu</span>
				<ul style="margin:8px 0 0;padding-left:1.1em;font-family:var(--f-read);color:var(--ink)">
					<li>Isi tulisan dan judul</li>
					<li>Mood dan nama tag</li>
					<li>Isi lampiran dan lokasi</li>
					<li>Sandi atau 24 kata pemulihan</li>
				</ul>
			</div>
		</div>
		<p class="t-baca" style="font-size:var(--text-sm);color:var(--ink-soft);margin-top:var(--s-4)">
			Daftar lengkapnya ada di <a href="/privasi">halaman privasi</a>, ditulis apa adanya.
		</p>
	</Kertas>
</section>
