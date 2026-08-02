<script lang="ts">
	import Kertas from '$components/dasar/Kertas.svelte';

	const bocor = [
		['Alamat email', 'Isi tulisan'],
		['Kapan entri dibuat dan diubah', 'Judul'],
		['Tanggal entri (entry_date)', 'Mood'],
		['Berapa banyak entri yang dimiliki', 'Nama tag'],
		['Bucket ukuran ciphertext (256B–128K)', 'Isi lampiran'],
		['Jumlah dan bucket ukuran lampiran', 'Lokasi'],
		['Alamat IP dan user agent (log 7 hari)', 'Sandi atau frasa pemulihan'],
		['Daftar perangkat dan kapan terakhir sync', '']
	];
</script>

<svelte:head>
	<title>Privasi · be-diary</title>
	<meta name="description" content="Apa yang dilihat server be-diary dan apa yang tidak, ditulis apa adanya." />
</svelte:head>

<article style="display:flex;flex-direction:column;gap:var(--s-5);padding-bottom:var(--s-6)">
	<h1 class="t-judul t-xl">Privasi, ditulis apa adanya</h1>
	<p
		style="margin:0;font-family:var(--f-read);font-size:var(--text-md);line-height:1.72;color:var(--ink-on-board-dim);max-width:62ch;text-wrap:pretty"
	>
		Halaman ini bukan syarat dan ketentuan. Ini daftar jujur soal apa yang bisa dan tidak bisa
		dilihat server, supaya kamu bisa memutuskan sendiri.
	</p>

	<Kertas padding="var(--s-6)">
		<h2 class="t-judul" style="color:var(--ink);font-size:var(--text-lg);margin-bottom:var(--s-4)">
			Kebocoran metadata
		</h2>
		<div style="overflow-x:auto">
			<table style="width:100%;border-collapse:collapse;min-width:420px">
				<thead>
					<tr>
						<th
							style="text-align:left;padding:8px 10px;border-bottom:2px solid rgb(27 27 23 / 0.3);font-family:var(--f-data);font-size:var(--text-2xs);letter-spacing:0.09em;text-transform:uppercase;color:var(--ink-soft)"
							>Server tahu</th
						>
						<th
							style="text-align:left;padding:8px 10px;border-bottom:2px solid rgb(27 27 23 / 0.3);font-family:var(--f-data);font-size:var(--text-2xs);letter-spacing:0.09em;text-transform:uppercase;color:var(--ink-soft)"
							>Server tidak tahu</th
						>
					</tr>
				</thead>
				<tbody>
					{#each bocor as [a, b], i (i)}
						<tr>
							<td
								style="padding:9px 10px;border-bottom:1px solid rgb(27 27 23 / 0.12);font-family:var(--f-read);font-size:var(--text-sm);color:var(--ink)"
								>{a}</td
							>
							<td
								style="padding:9px 10px;border-bottom:1px solid rgb(27 27 23 / 0.12);font-family:var(--f-read);font-size:var(--text-sm);color:var(--ink)"
								>{b}</td
							>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</Kertas>

	<Kertas warna="buram" padding="var(--s-6)">
		<h2 class="t-judul" style="color:var(--ink);font-size:var(--text-lg);margin-bottom:var(--s-3)">
			Yang perlu kamu tahu sebelum percaya
		</h2>
		<div class="prosa">
			<p>
				be-diary adalah aplikasi web. Artinya JavaScript yang menjalankan enkripsi dikirim oleh server
				setiap kali kamu membuka halaman. Kalau server dikompromikan, kode yang dikirim bisa diubah.
				Ini keterbatasan mendasar semua aplikasi E2EE berbasis web, dan kami tidak akan berpura-pura
				sebaliknya.
			</p>
			<p>
				Yang kami lakukan untuk menguranginya: tidak ada CDN pihak ketiga, semua aset di-host
				sendiri, CSP ketat tanpa <code>unsafe-inline</code> untuk skrip, kunci master hanya hidup di
				Web Worker terpisah, dan hash bundle setiap rilis dipublikasikan supaya bisa dibandingkan.
			</p>
			<p>
				Kalau ancaman yang kamu hadapi termasuk server yang dipaksa mengirim kode jahat, jalankan
				instansmu sendiri. Panduannya ada di <code>docs/SELF-HOSTING.md</code>.
			</p>
			<h3>Entri publik keluar dari enkripsi</h3>
			<p>
				Kalau kamu menerbitkan entri ke halaman publik, entri itu disimpan di server dalam bentuk
				yang bisa dibaca — itu memang tujuannya. Persetujuannya eksplisit, tidak pernah otomatis,
				dan entri privat asli tetap terenkripsi.
			</p>
			<h3>Data yang kami simpan</h3>
			<p>
				Email, ciphertext, metadata di tabel atas, dan log akses selama 7 hari. Tidak ada analitik
				pihak ketiga di halaman aplikasi. Cookie yang dipakai hanya refresh token dan preferensi
				tema.
			</p>
			<h3>Hak kamu</h3>
			<p>
				Ekspor lengkap tersedia kapan saja dari perangkatmu tanpa perlu meminta. Hapus akun memicu
				purge total di server dalam 7 hari.
			</p>
		</div>
	</Kertas>
</article>
