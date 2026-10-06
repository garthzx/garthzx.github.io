<script lang="ts">
	import SectionRule from './SectionRule.svelte';
	import { roles } from '$lib/data/experience';
	import { inview } from '$lib/motion.svelte';

	/** Roles with more highlights than this collapse to the first three. */
	const COLLAPSE_OVER = 4;

	let open = $state<Record<string, boolean>>({});
</script>

<section id="experience" aria-labelledby="exp-title" class="shell section">
	<div class="head">
		<SectionRule num="02" meta="2023–present" />
		<h2 id="exp-title" class="h-section" data-reveal use:inview>Experience</h2>
	</div>

	<ol class="roles">
		{#each roles as r (r.id)}
			{@const collapsible = r.bullets.length > COLLAPSE_OVER}
			{@const expanded = open[r.id] ?? false}
			{@const visible = collapsible && !expanded ? r.bullets.slice(0, 3) : r.bullets}
			<li data-reveal use:inview>
				<div class="when">
					<span class="dates">
						<svg width="10" height="10" aria-hidden="true"
							><rect x="1" y="1" width="8" height="8" class:current={r.current} /></svg
						>{r.dates}
					</span>
					<span class="place mono-label">{r.place}</span>
					{#if r.current}<span class="badge mono-label">Current role</span>{/if}
				</div>

				<div class="what">
					<div>
						<h3>{r.title}</h3>
						<p class="company">{r.company}</p>
					</div>
					{#if r.intro}<p class="intro">{r.intro}</p>{/if}
					<ul id="bullets-{r.id}" class="bullets">
						{#each visible as b (b)}
							<li><span aria-hidden="true" class="dash"></span><span>{b}</span></li>
						{/each}
					</ul>
					{#if collapsible}
						<button
							type="button"
							class="toggle mono-label"
							aria-expanded={expanded}
							aria-controls="bullets-{r.id}"
							onclick={() => (open[r.id] = !expanded)}
						>
							<span aria-hidden="true" class="sign">{expanded ? '−' : '+'}</span>
							{expanded ? 'Show fewer' : `Show all ${r.bullets.length} highlights`}
						</button>
					{/if}
				</div>
			</li>
		{/each}
	</ol>
</section>

<style>
	.head {
		display: flex;
		flex-direction: column;
		gap: 20px;
		margin-bottom: clamp(32px, 4vw, 56px);
	}
	.roles {
		display: flex;
		flex-direction: column;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.roles > li {
		display: flex;
		flex-wrap: wrap;
		gap: 12px clamp(24px, 5vw, 80px);
		padding: 32px 0;
		border-top: 1px solid var(--hair);
	}
	.when {
		flex: 0 1 240px;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.dates {
		display: flex;
		align-items: center;
		gap: 10px;
		font-family: var(--font-mono);
		font-size: 12.5px;
		letter-spacing: 0.04em;
	}
	.dates rect {
		fill: none;
		stroke: var(--ink);
		stroke-width: 1.5;
	}
	.dates rect.current {
		fill: var(--brand);
		stroke: var(--brand);
	}
	.place {
		padding-left: 20px;
		font-size: 11px;
		letter-spacing: 0.1em;
		color: var(--muted);
	}
	.badge {
		align-self: flex-start;
		margin-left: 20px;
		padding: 3px 7px;
		border: 1px solid var(--brand);
		border-radius: 2px;
		color: var(--brand);
		font-size: 11px;
		letter-spacing: 0.1em;
	}

	.what {
		flex: 1 1 480px;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}
	h3 {
		margin: 0 0 2px;
		font-family: var(--font-serif);
		font-weight: 500;
		font-size: clamp(23px, 2.2vw, 28px);
		line-height: 1.2;
		color: var(--deep);
		font-variation-settings: 'opsz' 28;
	}
	.company {
		margin: 0;
		color: var(--muted);
	}
	.intro {
		max-width: 68ch;
		margin: 0;
		text-wrap: pretty;
	}
	.bullets {
		display: flex;
		flex-direction: column;
		gap: 10px;
		max-width: 72ch;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.bullets li {
		display: flex;
		gap: 14px;
		font-size: 15.5px;
		line-height: 1.6;
		text-wrap: pretty;
	}
	.dash {
		flex: none;
		width: 12px;
		height: 1px;
		margin-top: 13px;
		background: var(--brass);
	}
	.toggle {
		align-self: flex-start;
		display: inline-flex;
		align-items: center;
		gap: 10px;
		min-height: 44px;
		padding: 0;
		background: none;
		border: 0;
		cursor: pointer;
		color: var(--brand);
		letter-spacing: 0.1em;
	}
	.toggle:hover {
		color: var(--brand-hover);
	}
	.sign {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 18px;
		height: 18px;
		border: 1px solid currentColor;
		border-radius: 2px;
		font-size: 13px;
		line-height: 1;
	}
</style>
