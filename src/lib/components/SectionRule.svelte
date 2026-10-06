<script lang="ts">
	import { inview } from '$lib/motion.svelte';

	let { num, meta }: { num: string; meta?: string } = $props();
</script>

<div class="rule-row mono-label">
	<span class="num">§ {num}</span>
	<span aria-hidden="true" class="line" data-rule use:inview></span>
	{#if meta}<span class="meta">{meta}</span>{/if}
</div>

<style>
	.rule-row {
		display: flex;
		align-items: center;
		gap: 16px;
	}
	.num {
		color: var(--brass-text);
	}
	.line {
		flex: 1;
		height: 1px;
		background: var(--hair);
	}
	.meta {
		color: var(--muted);
	}
</style>
