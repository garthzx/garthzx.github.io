<script lang="ts">
	import Icon from './Icon.svelte';
	import SectionRule from './SectionRule.svelte';
	import { featured, projects } from '$lib/data/projects';
	import { inview } from '$lib/motion.svelte';
	import { swipe } from '$lib/swipe';

	const pad2 = (n: number) => String(n).padStart(2, '0');
	const n = featured.slides.length;

	let slide = $state(0);
	const step = (d: number) => (slide = (slide + d + n) % n);
</script>

<section id="projects" aria-labelledby="proj-title" class="shell section">
	<div class="head">
		<SectionRule num="03" meta="2022–2026" />
		<h2 id="proj-title" class="h-section" data-reveal use:inview>Projects</h2>
	</div>

	<article class="featured" data-reveal use:inview>
		<div class="feat-media">
			<div class="mat" data-lift>
				<div
					class="stage"
					role="group"
					aria-roledescription="carousel"
					aria-label="{featured.title} screenshots"
					use:swipe={step}
				>
					{#each featured.slides as s, i (s.src)}
						<img
							src={s.src}
							alt={s.alt}
							loading="lazy"
							draggable="false"
							class:on={i === slide}
							aria-hidden={i === slide ? undefined : 'true'}
						/>
					{/each}
				</div>
				<div class="controls">
					<div class="dots">
						{#each featured.slides as s, i (s.src)}
							<button
								type="button"
								onclick={() => (slide = i)}
								aria-label="Show screenshot {i + 1}: {s.caption}"
								aria-current={i === slide ? 'true' : undefined}
							>
								<span class:on={i === slide}></span>
							</button>
						{/each}
					</div>
					<div class="arrows">
						<span class="counter" aria-live="polite">{pad2(slide + 1)} / {pad2(n)}</span>
						<button
							type="button"
							class="arrow"
							onclick={() => step(-1)}
							aria-label="Previous screenshot"><Icon name="arrow-left" /></button
						>
						<button type="button" class="arrow" onclick={() => step(1)} aria-label="Next screenshot"
							><Icon name="arrow-right" /></button
						>
					</div>
				</div>
			</div>
			<span class="plate-caption mono-label"
				>Plate {pad2(slide + 1)} — {featured.slides[slide].caption}</span
			>
		</div>

		<div class="feat-copy">
			<span class="mono-label brass">Featured · {featured.year}</span>
			<h3>{featured.title}</h3>
			<p>{featured.description}</p>
			<div class="tags">
				{#each featured.tech as t (t)}<span class="tag">{t}</span>{/each}
			</div>
			<a href={featured.href} class="arrow-link" data-nudge
				>View on GitHub<Icon name="arrow-right" /></a
			>
		</div>
	</article>

	<div class="subhead mono-label" data-reveal use:inview>
		<span>University &amp; early work</span>
		<span aria-hidden="true" class="line" data-rule use:inview></span>
		<span class="muted">2022–2024</span>
	</div>

	<div class="grid">
		{#each projects as p, i (p.title)}
			<article data-reveal data-delay={(i % 3) + 1} use:inview>
				<div class="mat" data-zoomable data-lift>
					{#if p.image}
						<div class="shot">
							<img src={p.image} alt={p.alt} loading="lazy" />
						</div>
					{:else if p.plate}
						<div class="plate" role="img" aria-label={p.alt}>
							<div class="plate-top"><span>{p.plate.top}</span><span>{p.year}</span></div>
							<div class="plate-mid"><span>{p.plate.mid}</span></div>
							<div class="plate-lines">
								{#each p.plate.lines as l (l)}<span>{l}</span>{/each}
							</div>
						</div>
					{/if}
				</div>
				<div class="card-body">
					<div class="card-title">
						<h3>{p.title}</h3>
						<span class="year">{p.year}</span>
					</div>
					<p>{p.description}</p>
					<div class="tags">
						{#each p.tech as t (t)}<span class="tag">{t}</span>{/each}
					</div>
					<a href={p.href} class="arrow-link small" data-nudge
						>{p.linkLabel}<Icon name="external" size={14} /><span class="sr-only-text">
							— {p.title}</span
						></a
					>
				</div>
			</article>
		{/each}
	</div>
</section>

<style>
	.head {
		display: flex;
		flex-direction: column;
		gap: 20px;
		margin-bottom: clamp(32px, 4vw, 56px);
	}
	.brass {
		color: var(--brass-text);
	}
	.muted {
		color: var(--muted);
	}
	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}

	/* Featured */
	.featured {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 28px clamp(32px, 5vw, 72px);
		margin-bottom: clamp(64px, 8vw, 104px);
	}
	.feat-media {
		flex: 1.7 1 520px;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.mat {
		padding: 12px;
		background: var(--tint);
		border: 1px solid var(--hair);
		border-radius: 2px;
	}
	.stage {
		position: relative;
		aspect-ratio: 16 / 10;
		overflow: hidden;
		border: 1px solid var(--hair);
		border-radius: 1px;
		background: var(--surface);
		touch-action: pan-y;
		cursor: grab;
	}
	.stage img {
		position: absolute;
		inset: 0;
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: top left;
		opacity: 0;
		transform: scale(1.03);
		transition:
			opacity 600ms var(--ez),
			transform 1200ms var(--ez);
		user-select: none;
	}
	.stage img.on {
		opacity: 1;
		transform: none;
	}
	.controls {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		padding-top: 12px;
	}
	.dots {
		display: flex;
		align-items: center;
		gap: 4px;
	}
	.dots button {
		display: flex;
		align-items: center;
		height: 32px;
		padding: 0 3px;
		background: none;
		border: 0;
		cursor: pointer;
	}
	.dots button span {
		display: block;
		width: 14px;
		height: 2px;
		background: var(--sage);
		transition:
			width 300ms var(--ez),
			background-color 300ms ease;
	}
	.dots button span.on {
		width: 28px;
		background: var(--brand);
	}
	.arrows {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.counter {
		min-width: 64px;
		text-align: right;
		font-family: var(--font-mono);
		font-size: 12px;
		letter-spacing: 0.06em;
		color: var(--muted);
	}
	.arrow {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		padding: 0;
		background: var(--surface);
		color: var(--ink);
		border: 1px solid var(--hair);
		border-radius: 4px;
		cursor: pointer;
	}
	.arrow:hover {
		border-color: var(--brand);
		color: var(--brand);
	}
	.arrow:active {
		transform: translateY(1px);
	}
	.plate-caption {
		font-size: 11px;
		letter-spacing: 0.1em;
		color: var(--muted);
	}
	.feat-copy {
		flex: 1 1 300px;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}
	.feat-copy h3 {
		margin: 0;
		font-family: var(--font-serif);
		font-weight: 400;
		font-size: clamp(30px, 3.2vw, 39px);
		line-height: 1.1;
		letter-spacing: -0.01em;
		color: var(--deep);
		font-variation-settings: 'opsz' 40;
	}
	.feat-copy p {
		margin: 0;
		text-wrap: pretty;
	}

	/* Early work */
	.subhead {
		display: flex;
		align-items: center;
		gap: 16px;
		margin-bottom: 32px;
	}
	.subhead .line {
		flex: 1;
		height: 1px;
		background: var(--hair);
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr));
		gap: 56px 32px;
	}
	.grid article {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	.grid .mat {
		padding: 10px;
	}
	.shot {
		aspect-ratio: 16 / 10;
		overflow: hidden;
		border: 1px solid var(--hair);
		border-radius: 1px;
		background: var(--surface);
	}
	.shot img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: top left;
	}
	.plate {
		box-sizing: border-box;
		aspect-ratio: 16 / 10;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: clamp(14px, 2vw, 20px);
		background: var(--surface);
		border: 1px solid var(--hair);
		border-radius: 1px;
	}
	.plate-top {
		display: flex;
		justify-content: space-between;
		font-family: var(--font-mono);
		font-size: 10.5px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--muted);
	}
	.plate-mid {
		padding: 12px 0;
		border-top: 1px solid var(--ink);
		border-bottom: 1px solid var(--hair);
		font-family: var(--font-serif);
		font-style: italic;
		font-size: clamp(22px, 2.4vw, 28px);
		line-height: 1.15;
		color: var(--deep);
		font-variation-settings: 'opsz' 28;
	}
	.plate-lines {
		display: flex;
		flex-wrap: wrap;
		gap: 4px 14px;
		font-family: var(--font-mono);
		font-size: 10.5px;
		letter-spacing: 0.06em;
		color: var(--brass-text);
	}
	.card-body {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.card-title {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 16px;
	}
	.card-title h3 {
		margin: 0;
		font-family: var(--font-serif);
		font-weight: 500;
		font-size: 23px;
		line-height: 1.2;
		color: var(--deep);
		font-variation-settings: 'opsz' 24;
	}
	.year {
		font-family: var(--font-mono);
		font-size: 12px;
		color: var(--muted);
	}
	.card-body p {
		margin: 0;
		font-size: 15px;
		line-height: 1.6;
		color: var(--muted);
		text-wrap: pretty;
	}
	.card-body .tags {
		margin-top: 4px;
	}
	.arrow-link.small {
		position: relative;
		gap: 6px;
	}
</style>
