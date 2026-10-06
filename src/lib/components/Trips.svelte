<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from './Icon.svelte';
	import SectionRule from './SectionRule.svelte';
	import Lightbox from './Lightbox.svelte';
	import { stops, photos, slotsWide, slotsCompact, plateOf, coordsOf } from '$lib/data/trips';
	import { intro, inview, motionOn } from '$lib/motion.svelte';

	const ADVANCE_MS = 6500;
	const LON_MIN = 119;
	const LON_SPAN = 6;

	let trip = $state(0);
	let run = $state(false);
	let paused = $state(false);
	let visible = $state(false);
	let still = $state(false);
	let lightbox = $state<number | null>(null);
	let stage: HTMLDivElement;
	let timer: ReturnType<typeof setTimeout>;

	// Each photo's position in its stop's layout, for both the wide and compact grids.
	const placed = photos.map((p, i) => {
		const k = photos.filter((q, j) => q.stop === p.stop && j < i).length;
		return { ...p, i, k, wide: slotsWide[p.stop].ph[k], compact: slotsCompact[p.stop].ph[k] };
	});

	const captionsFor = (s: number) =>
		placed.filter((p) => p.stop === s).map((p) => ({ plate: plateOf(p.i), text: p.caption }));

	const pct = (v: number) => `${v}%`;
	const lonX = (lon: number) => ((lon - LON_MIN) / LON_SPAN) * 100;

	/** Where a scale label sits relative to its marker, so neighbours don't collide. */
	function labelAlign(lon: number): [string, string] {
		if (lon > 123.6) return ['0%', '0%'];
		if (lon > 123) return ['100%', '-100%'];
		if (lon < 119.8) return ['0%', '0%'];
		return ['50%', '-50%'];
	}

	function arm() {
		clearTimeout(timer);
		const go = !still && visible && !paused && intro.done && lightbox === null;
		if (!go) {
			run = false;
			return;
		}
		// The progress rule restarts from zero: drop `run`, then raise it next frame.
		requestAnimationFrame(() => (run = true));
		timer = setTimeout(() => {
			trip = (trip + 1) % stops.length;
			run = false;
			arm();
		}, ADVANCE_MS);
	}

	function pick(i: number) {
		clearTimeout(timer);
		trip = i;
		run = false;
		arm();
	}

	onMount(() => {
		still = !motionOn();
		const io = new IntersectionObserver((e) => (visible = e[0].isIntersecting), {
			threshold: 0.35
		});
		io.observe(stage);
		// Hovering the stage holds the current stop.
		const hold = () => (paused = true);
		const release = () => (paused = false);
		stage.addEventListener('mouseenter', hold);
		stage.addEventListener('mouseleave', release);
		return () => {
			io.disconnect();
			stage.removeEventListener('mouseenter', hold);
			stage.removeEventListener('mouseleave', release);
			clearTimeout(timer);
		};
	});

	// arm() reads every condition that gates autoplay, so this re-arms
	// whenever one of them changes.
	$effect(() => arm());
</script>

<section id="away" aria-labelledby="away-title" class="shell section">
	<div class="rule-wrap">
		<SectionRule num="06" meta="Field log · {stops.length} stops" />
	</div>

	<div class="layout">
		<div class="side">
			<div class="intro-copy">
				<h2 id="away-title" class="h-section" data-reveal use:inview>Away from the keyboard</h2>
				<p data-reveal data-delay="1" use:inview>
					Mostly trips out of the city, to highlands and coastlines. Indie music on guitar when I’m
					home.
				</p>
			</div>

			<ol class="stops" aria-label="Trips" data-reveal data-delay="2" use:inview>
				{#each stops as s, i (s.place)}
					{@const on = i === trip}
					{@const count = photos.filter((p) => p.stop === i).length}
					<li class:on>
						<button type="button" onclick={() => pick(i)} aria-pressed={on}>
							<span class="s-num">0{i + 1}</span>
							<span class="s-place">{s.place}</span>
							<span class="s-count">{count} {count === 1 ? 'photo' : 'photos'}</span>
							<span class="s-region">{s.region}</span>
						</button>
						<span
							aria-hidden="true"
							class="s-progress"
							style:transform="scaleX({on && run && !still ? 1 : 0})"
							style:transition={on && run && !still ? `transform ${ADVANCE_MS}ms linear` : 'none'}
						></span>
					</li>
				{/each}
			</ol>

			<button type="button" class="view-all mono-label" data-nudge onclick={() => (lightbox = 0)}>
				View all {photos.length} photographs<Icon name="arrow-right" />
			</button>
		</div>

		<div class="main" data-reveal data-delay="1" use:inview>
			<div class="stage" class:still bind:this={stage} aria-live="polite">
				{#each placed as p (p.src)}
					{@const on = p.stop === trip}
					<button
						type="button"
						class="photo"
						class:on
						onclick={() => (lightbox = p.i)}
						aria-label="Enlarge photo: {p.caption}"
						aria-hidden={on ? undefined : 'true'}
						tabindex={on ? 0 : -1}
						style:--l={pct(p.wide[0])}
						style:--t={pct(p.wide[1])}
						style:--w={pct(p.wide[2])}
						style:--h={pct(p.wide[3])}
						style:--lc={pct(p.compact[0])}
						style:--tc={pct(p.compact[1])}
						style:--wc={pct(p.compact[2])}
						style:--hc={pct(p.compact[3])}
						style:--delay="{120 + p.k * 140}ms"
					>
						<img
							src={p.src}
							alt={p.alt}
							loading="lazy"
							draggable="false"
							style:object-position={p.pos}
						/>
						<span aria-hidden="true" class="chip">{plateOf(p.i)}</span>
					</button>
				{/each}

				{#each stops as s, i (s.place)}
					{@const card = slotsWide[i].card}
					<div
						class="card"
						class:on={i === trip}
						aria-hidden={i === trip ? undefined : 'true'}
						style:left={pct(card[0])}
						style:top={pct(card[1])}
						style:width={pct(card[2])}
						style:height={pct(card[3])}
					>
						<span aria-hidden="true" class="card-rule"></span>
						<span class="mono-label brass card-num">Stop 0{i + 1} / 0{stops.length}</span>
						<span class="card-place">{s.place}</span>
						<span class="card-meta"><span>{s.region}</span><span>{coordsOf(s)}</span></span>
						<ul class="caps">
							{#each captionsFor(i) as c (c.plate)}
								<li><span class="cap-plate">{c.plate}</span><span>{c.text}</span></li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>

			<div class="compact-cap">
				<span class="mono-label brass"
					>Stop 0{trip + 1} / 0{stops.length} · {coordsOf(stops[trip])}</span
				>
				<span class="cc-place">{stops[trip].place}</span>
				{#each captionsFor(trip) as c (c.plate)}
					<span class="cc-line"><span class="cap-plate">{c.plate}</span>{c.text}</span>
				{/each}
			</div>

			<div aria-hidden="true" class="scale">
				<span class="baseline"></span>
				{#each [119, 120, 121, 122, 123, 124, 125] as v (v)}
					<span
						class="tick"
						style:left="{lonX(v)}%"
						style:top={v % 2 ? '10px' : '12px'}
						style:height={v % 2 ? '9px' : '5px'}
					></span>
				{/each}
				<span class="end left">119° E</span>
				<span class="end right">Longitude · 125° E</span>
				{#each stops as s, i (s.place)}
					{@const on = i === trip}
					{@const [lx, ltx] = labelAlign(s.lon)}
					<button
						type="button"
						tabindex="-1"
						class="mark"
						class:on
						style:left="{lonX(s.lon)}%"
						onclick={() => pick(i)}
					>
						<span class="mark-label" style:left={lx} style:transform="translateX({ltx})"
							>{on ? s.place : `0${i + 1}`}</span
						>
						<span class="dot"></span>
					</button>
				{/each}
			</div>
		</div>
	</div>
</section>

{#if lightbox !== null}
	<Lightbox bind:index={lightbox} onclose={() => (lightbox = null)} />
{/if}

<style>
	.rule-wrap {
		margin-bottom: clamp(24px, 3vw, 40px);
	}
	.brass {
		color: var(--brass-text);
	}

	.layout {
		display: flex;
		flex-direction: column;
		gap: clamp(28px, 4vw, 56px);
	}
	.side {
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: clamp(24px, 3vw, 36px);
	}
	.main {
		flex: 1 1 0;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 18px;
	}
	.intro-copy {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}
	.intro-copy .h-section {
		text-wrap: balance;
	}
	.intro-copy p {
		margin: 0;
		font-size: 17px;
		line-height: 1.6;
		color: var(--muted);
		text-wrap: pretty;
	}

	/* Stop list: a horizontal strip on phones, a column beside the stage on desktop. */
	.stops {
		display: flex;
		flex-direction: row;
		gap: 16px;
		margin: 0 calc(-1 * var(--gutter));
		padding: 0 var(--gutter);
		scroll-padding: 0 var(--gutter);
		overflow-x: auto;
		list-style: none;
		scrollbar-width: none;
	}
	.stops::-webkit-scrollbar {
		display: none;
	}
	.stops li {
		position: relative;
		flex: 0 0 200px;
		border-top: 1px solid var(--hair);
		transition: border-color 300ms ease;
	}
	.stops li.on {
		border-top-color: var(--ink);
	}
	.stops button {
		display: grid;
		grid-template-columns: 34px minmax(0, 1fr) auto;
		align-items: baseline;
		gap: 4px 10px;
		width: 100%;
		padding: 14px 0;
		background: none;
		border: 0;
		text-align: left;
		cursor: pointer;
		color: var(--ink);
	}
	.s-num {
		font-family: var(--font-mono);
		font-size: 11.5px;
		letter-spacing: 0.08em;
		color: var(--brass-text);
		transition: color 300ms ease;
	}
	.s-place {
		font-family: var(--font-serif);
		font-size: 23px;
		line-height: 1.15;
		color: var(--muted);
		transition: color 300ms ease;
	}
	.on .s-num {
		color: var(--brand);
	}
	.on .s-place {
		color: var(--deep);
	}
	.s-count {
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--muted);
	}
	.s-region {
		grid-column: 2 / 4;
		font-family: var(--font-mono);
		font-size: 10.5px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--muted);
	}
	.s-progress {
		position: absolute;
		left: 0;
		right: 0;
		top: -1px;
		height: 1px;
		background: var(--brand);
		transform-origin: left center;
	}

	.view-all {
		display: none;
		align-self: flex-start;
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
	.view-all:hover {
		color: var(--brand-hover);
	}

	/* Stage */
	.stage {
		position: relative;
		height: 480px;
	}
	.photo {
		position: absolute;
		left: var(--lc);
		top: var(--tc);
		width: var(--wc);
		height: var(--hc);
		padding: 0;
		border: 0;
		border-radius: 2px;
		overflow: hidden;
		background: var(--tint);
		cursor: zoom-in;
		opacity: 0;
		transform: translateY(18px) scale(0.985);
		pointer-events: none;
		transition:
			opacity 380ms var(--ez),
			transform 600ms var(--ez);
	}
	.photo.on {
		opacity: 1;
		transform: none;
		pointer-events: auto;
		transition:
			opacity 800ms var(--ez) var(--delay),
			transform 1000ms var(--ez) var(--delay);
	}
	.photo img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transform: scale(1);
		transition: transform 1200ms var(--ez);
		user-select: none;
	}
	/* A slow push-in while a stop is on screen. */
	.photo.on img {
		transform: scale(1.08);
		transition: transform 14s linear;
	}
	.still .photo,
	.still .photo img {
		transition: none;
	}
	.still .photo.on img {
		transform: none;
	}
	.chip {
		position: absolute;
		left: 10px;
		bottom: 10px;
		padding: 5px 8px;
		background: var(--paper);
		color: var(--ink);
		border-radius: 2px;
		font-family: var(--font-mono);
		font-size: 10px;
		letter-spacing: 0.08em;
	}

	.card {
		position: absolute;
		box-sizing: border-box;
		display: none;
		flex-direction: column;
		justify-content: flex-end;
		gap: 10px;
		opacity: 0;
		transform: translateY(12px);
		pointer-events: none;
		transition:
			opacity 300ms var(--ez),
			transform 500ms var(--ez);
	}
	.card.on {
		opacity: 1;
		transform: none;
		transition:
			opacity 700ms var(--ez) 420ms,
			transform 900ms var(--ez) 420ms;
	}
	.still .card {
		transition: none;
	}
	.card-rule {
		display: block;
		height: 1px;
		margin-bottom: 4px;
		background: var(--ink);
	}
	.card-num {
		font-size: 11px;
	}
	.card-place {
		font-family: var(--font-serif);
		font-style: italic;
		font-size: clamp(34px, 3.6vw, 52px);
		line-height: 1;
		letter-spacing: -0.015em;
		color: var(--deep);
	}
	.card-meta {
		display: flex;
		flex-direction: column;
		font-family: var(--font-mono);
		font-size: 11px;
		letter-spacing: 0.06em;
		color: var(--muted);
	}
	.caps {
		display: flex;
		flex-direction: column;
		gap: 4px;
		margin: 6px 0 0;
		padding: 0;
		list-style: none;
		font-size: 14px;
		line-height: 1.45;
	}
	.caps li {
		display: flex;
		gap: 10px;
	}
	.cap-plate {
		padding-top: 2px;
		font-family: var(--font-mono);
		font-size: 10.5px;
		color: var(--brass-text);
	}

	.compact-cap {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding-top: 12px;
		border-top: 1px solid var(--ink);
	}
	.compact-cap .mono-label {
		font-size: 11px;
	}
	.cc-place {
		font-family: var(--font-serif);
		font-style: italic;
		font-size: 34px;
		line-height: 1.05;
		color: var(--deep);
	}
	.cc-line {
		display: flex;
		gap: 10px;
		font-size: 14px;
		line-height: 1.45;
	}

	/* Longitude scale */
	.scale {
		position: relative;
		height: 46px;
		margin-top: 6px;
	}
	.baseline {
		position: absolute;
		left: 0;
		right: 0;
		top: 14px;
		height: 1px;
		background: var(--hair);
	}
	.tick {
		position: absolute;
		width: 1px;
		background: var(--sage);
	}
	.end {
		position: absolute;
		top: 26px;
		font-family: var(--font-mono);
		font-size: 10px;
		letter-spacing: 0.06em;
		color: var(--muted);
	}
	.end.left {
		left: 0;
	}
	.end.right {
		right: 0;
	}
	.mark {
		position: absolute;
		top: 10px;
		width: 9px;
		height: 9px;
		margin-left: -4.5px;
		padding: 0;
		background: none;
		border: 0;
		cursor: pointer;
	}
	.mark-label {
		position: absolute;
		bottom: 14px;
		white-space: nowrap;
		font-family: var(--font-mono);
		font-size: 9.5px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--muted);
		transition: color 300ms ease;
	}
	.dot {
		display: block;
		box-sizing: border-box;
		width: 9px;
		height: 9px;
		border-radius: 50%;
		border: 1.5px solid var(--muted);
		background: var(--paper);
		transition:
			transform 400ms var(--ez),
			background-color 300ms ease,
			border-color 300ms ease;
	}
	.mark.on .mark-label {
		color: var(--brand);
	}
	.mark.on .dot {
		border-color: var(--brand);
		background: var(--brand);
		transform: scale(1.3);
	}

	/* ≥760px: the wide photo layout, with the caption card set into it. */
	@media (min-width: 760px) {
		.stops {
			flex-direction: column;
			gap: 0;
			margin: 0;
			padding: 0;
			overflow-x: visible;
			border-bottom: 1px solid var(--hair);
		}
		.stops li {
			flex: 0 0 auto;
		}
		.stage {
			height: 640px;
		}
		.photo {
			left: var(--l);
			top: var(--t);
			width: var(--w);
			height: var(--h);
		}
		.card {
			display: flex;
		}
		.compact-cap {
			display: none;
		}
	}

	/* ≥880px: stops beside the stage. */
	@media (min-width: 880px) {
		.layout {
			flex-direction: row;
		}
		.side {
			flex: 0 0 300px;
		}
		.view-all {
			display: inline-flex;
		}
	}
</style>
