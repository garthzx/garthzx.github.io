<script lang="ts">
	import Icon from './Icon.svelte';
	import SectionRule from './SectionRule.svelte';
	import SystemDiagram from './SystemDiagram.svelte';
	import { cases, caseHref } from '$lib/data/cases';
	import { inview } from '$lib/motion.svelte';
</script>

<section id="systems" aria-labelledby="systems-title" class="shell section">
	<div class="head">
		<SectionRule num="01" meta="Dentalflo AI · 2025–" />
		<div class="title-row">
			<h2 id="systems-title" class="h-section" data-reveal use:inview>Selected systems</h2>
			<p class="lede" data-reveal data-delay="2" use:inview>
				Three systems I own on a multi-tenant dental practice-management and patient-communication
				platform. In each diagram the solid green line is the happy path and the dashed brass line
				is the rollback path.
			</p>
		</div>
	</div>

	<div class="cases">
		{#each cases as c (c.slug)}
			<article>
				<div class="summary" data-reveal use:inview>
					<div class="label">
						<span class="mono-label brass">System {c.num}</span>
						<h3>{c.title}</h3>
					</div>
					<div class="body">
						<p class="lead">{c.summary}</p>
						<ul class="outcomes">
							{#each c.outcomes as o (o)}
								<li>
									<svg width="10" height="10" aria-hidden="true"
										><rect x="1" y="1" width="8" height="8" /></svg
									><span>{o}</span>
								</li>
							{/each}
						</ul>
						<div class="tags">
							{#each c.tags as t (t)}<span class="tag">{t}</span>{/each}
						</div>
						<a href={caseHref(c.slug)} class="arrow-link" data-nudge
							>Read the case study<Icon name="arrow-right" /></a
						>
					</div>
				</div>

				<figure data-reveal data-delay="1" use:inview>
					<div class="frame" data-lift>
						<SystemDiagram kind={c.slug} minWidth={760} />
					</div>
					<figcaption class="mono-label">
						<span>Fig. {c.num} — {c.fig}</span>
						<span class="scroll-hint">Scroll sideways for the full diagram →</span>
					</figcaption>
				</figure>
			</article>
		{/each}
	</div>
</section>

<style>
	.head {
		display: flex;
		flex-direction: column;
		gap: 20px;
		margin-bottom: clamp(40px, 5vw, 64px);
	}
	.title-row {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		justify-content: space-between;
		gap: 16px 64px;
	}
	.lede {
		flex: 0 1 520px;
		margin: 0;
		color: var(--muted);
		text-wrap: pretty;
	}

	.cases {
		display: flex;
		flex-direction: column;
		gap: clamp(64px, 8vw, 112px);
	}
	article {
		display: flex;
		flex-direction: column;
		gap: 28px;
	}
	.summary {
		display: flex;
		flex-wrap: wrap;
		gap: 20px clamp(32px, 5vw, 80px);
		padding-top: 24px;
		border-top: 1px solid var(--ink);
	}
	.label {
		flex: 1 1 300px;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.brass {
		color: var(--brass-text);
	}
	h3 {
		margin: 0;
		font-family: var(--font-serif);
		font-weight: 400;
		font-size: clamp(28px, 3vw, 36px);
		line-height: 1.12;
		letter-spacing: -0.01em;
		color: var(--deep);
		font-variation-settings: 'opsz' 36;
		text-wrap: balance;
	}
	.body {
		flex: 1.5 1 420px;
		display: flex;
		flex-direction: column;
		gap: 18px;
	}
	.lead {
		margin: 0;
		font-size: 18px;
		line-height: 1.55;
		text-wrap: pretty;
	}
	.outcomes {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.outcomes li {
		display: flex;
		gap: 12px;
		font-size: 15px;
		line-height: 1.55;
	}
	.outcomes svg {
		flex: none;
		margin-top: 8px;
	}
	.outcomes rect {
		fill: none;
		stroke: var(--brand);
		stroke-width: 1.5;
	}
	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}

	figure {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin: 0;
	}
	.frame {
		overflow: hidden;
		padding: clamp(4px, 1.5vw, 16px);
		background: var(--surface);
		border: 1px solid var(--hair);
		border-radius: 4px;
	}
	figcaption {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 8px 24px;
		font-size: 11px;
		letter-spacing: 0.1em;
		color: var(--muted);
	}
	@media (min-width: 880px) {
		.scroll-hint {
			display: none;
		}
	}
</style>
