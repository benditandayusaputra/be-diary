<script lang="ts">
	import { tema } from '$lib/state/tema.svelte.ts';

	interface Props {
		ringkas?: boolean;
	}
	let { ringkas = false }: Props = $props();
</script>

<button
	type="button"
	class={ringkas ? 'tbl-ikon' : 'tbl-papan'}
	aria-label="Ganti mode terang gelap"
	onclick={() => tema.toggleMode()}
>
	<span style="width:13px;height:13px;border-radius:50%;background:var(--pin-brass)"></span>
	{#if !ringkas}{tema.modeLabel}{/if}
</button>
