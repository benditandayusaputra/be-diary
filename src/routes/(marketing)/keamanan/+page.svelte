<script lang="ts">
	import Kertas from '$components/dasar/Kertas.svelte';

	const primitif = [
		['Key stretching', 'Argon2id', 'm = 64 MiB, t = 3, p = 1, keluaran 32 byte'],
		['Derivasi sub-kunci', 'HKDF-SHA-256', 'info berlabel versi'],
		['Enkripsi simetris', 'XChaCha20-Poly1305 (IETF)', 'nonce 24 byte acak, AAD wajib'],
		['Hash', 'BLAKE2b-256', 'blind index tag'],
		['Mnemonic', 'BIP-39', '256 bit entropi, 24 kata']
	];
</script>

<svelte:head>
	<title>Keamanan · be-diary</title>
</svelte:head>

<article style="display:flex;flex-direction:column;gap:var(--s-5);padding-bottom:var(--s-6)">
	<h1 class="t-judul t-xl">Keamanan dan kriptografi</h1>

	<Kertas padding="var(--s-6)">
		<h2 class="t-judul" style="color:var(--ink);font-size:var(--text-lg);margin-bottom:var(--s-4)">
			Primitif
		</h2>
		<div style="overflow-x:auto">
			<table style="width:100%;border-collapse:collapse;min-width:520px">
				<tbody>
					{#each primitif as [a, b, c], i (i)}
						<tr>
							<td
								style="padding:9px 10px;border-bottom:1px solid rgb(27 27 23 / 0.12);font-family:var(--f-data);font-size:var(--text-2xs);letter-spacing:0.06em;text-transform:uppercase;color:var(--ink-soft);white-space:nowrap"
								>{a}</td
							>
							<td
								style="padding:9px 10px;border-bottom:1px solid rgb(27 27 23 / 0.12);font-family:var(--f-data);font-size:var(--text-sm);color:var(--ink)"
								>{b}</td
							>
							<td
								style="padding:9px 10px;border-bottom:1px solid rgb(27 27 23 / 0.12);font-family:var(--f-read);font-size:var(--text-sm);color:var(--ink-soft)"
								>{c}</td
							>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</Kertas>

	<Kertas warna="buram" padding="var(--s-6)">
		<div class="prosa">
			<h2>Hierarki kunci</h2>
			<pre><code>Sandi --Argon2id(salt_user)--&gt; Stretched Key 32B
  |--HKDF "be-diary:auth:v1"--&gt; Auth Key   (dikirim ke server, di-hash ulang)
  `--HKDF "be-diary:kek:v1" --&gt; KEK        (tidak pernah keluar perangkat)

Master Key 32B acak
  |--dibungkus KEK-----------&gt; wrapped_master_key
  |--dibungkus Recovery Key--&gt; recovery_wrapped_mk
  |--HKDF "be-diary:index:v1"---&gt; Index Key (blind index tag)
  `--membungkus--------------&gt; DEK per entri --&gt; ciphertext entri</code></pre>

			<h2>Melaporkan kerentanan</h2>
			<p>
				Kirim ke alamat kontak di <code>SECURITY.md</code>. Kebijakan disclosure 90 hari. Semua
				perubahan pada <code>src/lib/crypto/</code> butuh review dua maintainer.
			</p>

			<h2>Model ancaman singkat</h2>
			<ul>
				<li>
					<strong>Operator server jahat atau dipaksa hukum</strong> — hanya mendapat ciphertext dan
					metadata yang didokumentasikan.
				</li>
				<li>
					<strong>Pencuri sandi</strong> — perangkat baru tidak otomatis dapat kunci. Mode Diperkuat
					menghapus jalur sandi sepenuhnya.
				</li>
				<li>
					<strong>XSS</strong> — ancaman paling serius. CSP ketat, kunci di Web Worker, semua
					markdown lewat DOMPurify, halaman publik dipisah dari bundle aplikasi.
				</li>
				<li>
					<strong>Perangkat dicuri</strong> — kunci aplikasi dengan PIN lokal, kunci dibuang dari
					memori saat terkunci.
				</li>
			</ul>
		</div>
	</Kertas>
</article>
