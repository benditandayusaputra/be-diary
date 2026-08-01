<script lang="ts">
	import SaklarMode from '$components/nav/SaklarMode.svelte';
	import { i18n } from '$lib/state/i18n.svelte.ts';

	let { children } = $props();
</script>

<div class="ruangan">
	<div class="shell shell-sempit">
		<header
			style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding-bottom:var(--s-6)"
		>
			<a
				href="/"
				style="display:flex;align-items:center;gap:12px;text-decoration:none;color:var(--ink-on-board)"
			>
				<span
					style="width:15px;height:15px;border-radius:var(--r-pin);background:radial-gradient(circle at 33% 27%, #F3DFAA 0%, #D9A845 32%, var(--pin-brass) 58%, #6E4A12 100%);box-shadow:1px 2px 0 rgb(0 0 0 / 0.3)"
				></span>
				<span class="t-judul t-lg">be-diary</span>
			</a>
			<nav style="margin-left:auto;display:flex;align-items:center;gap:var(--s-3);flex-wrap:wrap">
				<a href="/read" class="tbl-papan" style="text-decoration:none">Baca publik</a>
				<a href="/privasi" class="tbl-papan" style="text-decoration:none">Privasi</a>
				<SaklarMode />
				<a href="/masuk" class="tbl" style="text-decoration:none">{i18n.t.auth.masuk}</a>
			</nav>
		</header>

		{@render children()}

		<footer
			style="margin-top:var(--s-9);padding-top:var(--s-5);border-top:1px solid rgb(255 255 255 / 0.1);display:flex;flex-wrap:wrap;gap:var(--s-4);justify-content:space-between"
		>
			<span class="t-data">AGPL-3.0-or-later · kode terbuka</span>
			<div style="display:flex;gap:var(--s-4);flex-wrap:wrap">
				<a href="/privasi" class="t-data" style="color:var(--ink-on-board-dim)">Privasi</a>
				<a href="/keamanan" class="t-data" style="color:var(--ink-on-board-dim)">Keamanan</a>
				<a href="/read" class="t-data" style="color:var(--ink-on-board-dim)">Feed publik</a>
			</div>
		</footer>
	</div>
</div>
