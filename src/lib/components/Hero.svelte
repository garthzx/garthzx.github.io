<script lang="ts">
	import Icon from './Icon.svelte';
	import portrait from '$lib/assets/me.jpg';
	import { site, facts } from '$lib/data/site';
	import { inview } from '$lib/motion.svelte';

	const words = site.name.split(' ');
</script>

<section aria-labelledby="hero-title" class="shell hero">
	<div class="top">
		<div class="copy">
			<p class="now mono-label" data-reveal use:inview>
				<svg width="8" height="8" aria-hidden="true"><circle cx="4" cy="4" r="4" /></svg>Currently
				at
				{site.company.name}
			</p>
			<div class="titles">
				<h1 id="hero-title">
					{#each words as word, i (word)}
						<span class="line" data-line data-delay={i + 1} use:inview><span>{word}</span></span
						><!-- A real space, so the heading reads as words; Svelte trims a bare one at the end of a block. -->
						<!-- eslint-disable-next-line svelte/no-useless-mustaches -->
						{' '}
					{/each}
				</h1>
				<p class="role" data-reveal data-delay="4" use:inview>{site.role} — {site.focus}</p>
			</div>
			<p class="statement" data-reveal data-delay="5" use:inview>{site.statement}</p>
			<div class="ctas" data-reveal data-delay="6" use:inview>
				<a href="#systems" class="btn btn-primary" data-nudge
					>View selected systems <Icon name="arrow-right" /></a
				>
				<a href={site.resume.href} download class="btn btn-outline"
					><Icon name="download" />Download résumé</a
				>
				<a href="#contact" class="touch-link">Get in touch</a>
			</div>
		</div>

		<figure class="portrait" data-reveal data-delay="4" use:inview>
			<div class="mat">
				<img src={portrait} alt="Portrait of {site.name}" width="400" height="400" />
			</div>
			<figcaption class="mono-label">
				<span>{site.city}</span><span>{site.countryCode}</span>
			</figcaption>
		</figure>
	</div>

	<div aria-hidden="true" class="rule" data-rule use:inview></div>

	<dl class="facts" data-reveal data-delay="3" use:inview>
		{#each facts as fact (fact.label)}
			<div>
				<dt class="mono-label">{fact.label}</dt>
				<dd>{fact.value}</dd>
			</div>
		{/each}
	</dl>
</section>

<style>
	.hero {
		padding-top: clamp(56px, 9vw, 120px);
		padding-bottom: clamp(48px, 7vw, 96px);
	}
	.top {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		gap: 48px clamp(32px, 6vw, 96px);
	}
	.copy {
		flex: 1 1 560px;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 28px;
	}
	.now {
		display: flex;
		align-items: center;
		gap: 10px;
		margin: 0;
		color: var(--muted);
	}
	.now circle {
		fill: var(--brand);
	}
	.titles {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	h1 {
		margin: 0;
		font-family: var(--font-serif);
		font-weight: 400;
		font-size: clamp(44px, 6.4vw, 76px);
		line-height: 1.02;
		letter-spacing: -0.022em;
		color: var(--deep);
		font-variation-settings: 'opsz' 72;
		text-wrap: balance;
	}
	.line {
		display: inline-block;
		overflow: hidden;
		vertical-align: top;
		padding-bottom: 0.08em;
	}
	.line > span {
		display: inline-block;
	}
	.role {
		margin: 0;
		font-family: var(--font-serif);
		font-style: italic;
		font-size: clamp(20px, 2.2vw, 25px);
		line-height: 1.3;
		color: var(--muted);
		font-variation-settings: 'opsz' 24;
		text-wrap: balance;
	}
	.statement {
		margin: 0;
		max-width: 34ch;
		font-size: clamp(18px, 1.6vw, 20px);
		line-height: 1.55;
		text-wrap: pretty;
	}
	.ctas {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px 16px;
	}
	.touch-link {
		display: inline-flex;
		align-items: center;
		min-height: 48px;
		padding: 0 4px;
		font-size: 15px;
		font-weight: 500;
	}

	.portrait {
		flex: 0 1 260px;
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin: 0;
	}
	.mat {
		padding: 8px;
		background: var(--surface);
		border: 1px solid var(--hair);
		border-radius: 2px;
	}
	.mat img {
		display: block;
		width: 100%;
		height: auto;
		aspect-ratio: 1 / 1;
		object-fit: cover;
		border-radius: 1px;
	}
	figcaption {
		display: flex;
		justify-content: space-between;
		font-size: 11px;
		color: var(--muted);
	}

	.rule {
		height: 1px;
		margin-top: clamp(48px, 7vw, 88px);
		background: var(--ink);
	}
	.facts {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		margin: 0;
	}
	.facts > div {
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding: 16px 24px 16px 0;
		border-bottom: 1px solid var(--hair);
	}
	dt {
		font-size: 11px;
		color: var(--brass-text);
	}
	dd {
		margin: 0;
		font-size: 15px;
		line-height: 1.5;
	}
</style>
