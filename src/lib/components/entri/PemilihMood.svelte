<script lang="ts">
	import { pinOf, moodLabel } from '$lib/utils/kertas.ts';
	import { i18n } from '$lib/state/i18n.svelte.ts';

	interface Props {
		nilai: number | null;
		onpilih: (m: number | null) => void;
	}

	let { nilai, onpilih }: Props = $props();
</script>

<div style="display:flex;gap:10px" role="group" aria-label={i18n.t.app.mood}>
	{#each [1, 2, 3, 4, 5] as m (m)}
		<button
			type="button"
			aria-label={moodLabel(m, i18n.locale)}
			title={moodLabel(m, i18n.locale)}
			aria-pressed={nilai === m}
			style="cursor:pointer;width:44px;height:44px;display:grid;place-items:center;border:2px solid {nilai ===
			m
				? 'var(--accent)'
				: 'transparent'};background:{nilai === m
				? 'rgb(43 79 142 / 0.1)'
				: 'transparent'};border-radius:var(--r-control)"
			onclick={() => onpilih(nilai === m ? null : m)}
		>
			<span
				style="width:20px;height:20px;border-radius:var(--r-pin);background:{pinOf(
					m
				)};box-shadow:1px 2px 0 rgb(0 0 0 / 0.28), 3px 5px 7px -2px rgb(0 0 0 / 0.45)"
			></span>
		</button>
	{/each}
</div>
