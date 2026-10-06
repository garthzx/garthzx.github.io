<script lang="ts">
	import SectionRule from './SectionRule.svelte';
	import { recognition } from '$lib/data/experience';
	import { inview } from '$lib/motion.svelte';
</script>

<section id="about" aria-labelledby="edu-title" class="shell section">
	<div class="head">
		<SectionRule num="05" />
		<h2 id="edu-title" class="h-section" data-reveal use:inview>Education &amp; recognition</h2>
	</div>
	<div class="grid">
		{#each recognition as item, i (item.title)}
			<div class="item" data-reveal data-delay={i + 1} use:inview>
				<span class="when">{item.when}</span>
				<h3>{item.title}</h3>
				<p>{item.detail}</p>
			</div>
		{/each}
	</div>
</section>

<style>
	.head {
		display: flex;
		flex-direction: column;
		gap: 20px;
		margin-bottom: clamp(24px, 3vw, 40px);
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
		gap: 32px;
	}
	.item {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding-top: 18px;
		border-top: 1px solid var(--ink);
	}
	.when {
		font-family: var(--font-mono);
		font-size: 12px;
		letter-spacing: 0.08em;
		color: var(--brass-text);
	}
	h3 {
		margin: 0;
		font-family: var(--font-serif);
		font-weight: 500;
		font-size: 23px;
		line-height: 1.25;
		color: var(--deep);
	}
	p {
		margin: 0;
		font-size: 15px;
		line-height: 1.6;
		color: var(--muted);
	}
</style>
