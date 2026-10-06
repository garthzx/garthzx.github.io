<script lang="ts">
	import { onMount } from 'svelte';
	import SectionRule from './SectionRule.svelte';
	import { skills, rings, orderedTools, groupCounts, textMarks, tools } from '$lib/data/toolkit';
	import { toolIcons } from '$lib/data/tool-icons';
	import { intro, inview, motionOn } from '$lib/motion.svelte';

	// Lay the tools out round each orbit, offsetting each ring a little so
	// tiles don't line up radially.
	const orbitData = (() => {
		let idx = 0;
		return rings.map((ring, ri) => {
			const items = orderedTools.slice(idx, idx + ring.n);
			idx += ring.n;
			return {
				...ring,
				tiles: items.map((tool, k) => {
					const a = (k / ring.n) * Math.PI * 2 + ri * 0.37;
					return { tool, x: Math.cos(a) * ring.r, y: Math.sin(a) * ring.r };
				})
			};
		});
	})();

	let active = $state(0);
	let hold = $state(false);
	let paused = $state(false);
	let still = $state(false);
	let visible = false;
	let section: HTMLElement;
	let box: HTMLDivElement;

	const status = $derived(still ? 'Static' : paused ? 'Paused' : hold ? 'Selected' : 'Cycling');

	function pick(i: number) {
		if (active !== i || !hold) {
			active = i;
			hold = true;
		}
	}

	onMount(() => {
		still = !motionOn();
		// Leaving the section releases a group picked by hover or click.
		const release = () => (hold = false);
		section.addEventListener('mouseleave', release);
		const io = new IntersectionObserver((e) => (visible = e[0].isIntersecting), {
			threshold: 0.25
		});
		io.observe(box);
		const timer = still
			? undefined
			: setInterval(() => {
					if (visible && !paused && !hold && intro.done) active = (active + 1) % skills.length;
				}, 3200);
		return () => {
			section.removeEventListener('mouseleave', release);
			io.disconnect();
			clearInterval(timer);
		};
	});
</script>

<section id="toolkit" aria-labelledby="tool-title" class="shell section" bind:this={section}>
	<div class="head">
		<SectionRule num="04" meta="{skills.length} groups · {tools.length} tools" />
		<div class="title-row">
			<h2 id="tool-title" class="h-section" data-reveal use:inview>Toolkit</h2>
			<p class="lede" data-reveal data-delay="1" use:inview>
				Grouped as on my résumé. Select a group to trace it through the field.
			</p>
		</div>
	</div>

	<div class="layout">
		<figure class="fig" aria-hidden="true" data-reveal data-delay="1" use:inview>
			<div
				class="box"
				class:paused
				bind:this={box}
				onmouseenter={() => (paused = true)}
				onmouseleave={() => (paused = false)}
				role="presentation"
			>
				<div class="field">
					<svg class="orbits" viewBox="0 0 680 680">
						{#each rings as ring, i (ring.r)}
							<circle cx="340" cy="340" r={ring.r} class:dashed={i === 1} />
						{/each}
					</svg>

					{#each orbitData as ring (ring.r)}
						<div
							class="spinner"
							style:animation-duration="{ring.dur}s"
							style:animation-direction={ring.reverse ? 'reverse' : 'normal'}
						>
							<svg class="spokes" viewBox="-340 -340 680 680">
								{#each ring.tiles as tile (tile.tool[0])}
									<line
										x1="0"
										y1="0"
										x2={tile.x}
										y2={tile.y}
										pathLength="1"
										class:on={tile.tool[2] === active}
									/>
								{/each}
							</svg>
							{#each ring.tiles as tile (tile.tool[0])}
								{@const on = tile.tool[2] === active}
								<div
									class="slot"
									title={tile.tool[0]}
									style:left="calc({tile.x - 24} * var(--u))"
									style:top="calc({tile.y - 24} * var(--u))"
								>
									<div
										class="upright"
										style:animation-duration="{ring.dur}s"
										style:animation-direction={ring.reverse ? 'normal' : 'reverse'}
									>
										<div class="tile" class:on>
											{#if tile.tool[1]}
												<svg viewBox="0 0 24 24" class="logo"
													><path d={toolIcons[tile.tool[1]]} /></svg
												>
											{:else}
												<span class="mark">{textMarks[tile.tool[0]]}</span>
											{/if}
											<span class="tile-label">{tile.tool[0]}</span>
										</div>
									</div>
								</div>
							{/each}
						</div>
					{/each}

					<div class="core">
						<span class="core-num">Group 0{active + 1} / 0{skills.length}</span>
						<span class="core-name">{skills[active].group}</span>
					</div>
				</div>

				<div class="corner left">Fig. T — Toolkit field</div>
				<div class="corner right">
					<span class="pulse" class:still={still || paused}></span>{status}
				</div>
			</div>
		</figure>

		<ul class="groups">
			{#each skills as g, i (g.group)}
				{@const on = i === active}
				<li data-reveal use:inview class:on>
					<button
						type="button"
						onclick={() => pick(i)}
						onmouseenter={() => pick(i)}
						onfocus={() => pick(i)}
						aria-pressed={on}
					>
						<span class="g-head mono-label">
							<svg width="10" height="10" aria-hidden="true"
								><rect x="1" y="1" width="8" height="8" /></svg
							>
							<span class="g-name">{g.group}</span>
							<span class="g-count">{String(groupCounts[i]).padStart(2, '0')}</span>
						</span>
						<span class="g-items">{g.items}</span>
					</button>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	.head {
		display: flex;
		flex-direction: column;
		gap: 20px;
		margin-bottom: clamp(28px, 4vw, 48px);
	}
	.title-row {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		justify-content: space-between;
		gap: 16px 64px;
	}
	.lede {
		flex: 0 1 440px;
		margin: 0;
		color: var(--muted);
		text-wrap: pretty;
	}

	.layout {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 40px clamp(32px, 5vw, 64px);
	}
	.fig {
		position: relative;
		flex: 1.25 1 0;
		width: 100%;
		max-width: 560px;
		min-width: 0;
		margin: 0;
	}
	.groups {
		flex: 1 1 0;
		width: 100%;
		min-width: 0;
		display: flex;
		flex-direction: column;
		margin: 0;
		padding: 0;
		list-style: none;
		border-bottom: 1px solid var(--hair);
	}
	@media (min-width: 1000px) {
		.layout {
			flex-direction: row-reverse;
			align-items: flex-start;
		}
		.fig {
			position: sticky;
			top: 96px;
			max-width: none;
		}
	}

	/* The field is designed on a 680px square. --u is one of those pixels at
	   the box's actual width, so the whole drawing scales with no JS. */
	.box {
		container-type: inline-size;
		position: relative;
		width: 100%;
		aspect-ratio: 1 / 1;
		overflow: hidden;
		background-color: var(--surface);
		background-image: radial-gradient(var(--hair) 1px, transparent 1.2px);
		background-size: 24px 24px;
		background-position: 12px 12px;
		border: 1px solid var(--hair);
		border-radius: 4px;
	}
	.field {
		--u: calc(100cqw / 680);
		position: absolute;
		inset: 0;
	}
	.orbits {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}
	.orbits circle {
		fill: none;
		stroke: var(--hair);
		stroke-width: 1;
	}
	.orbits circle.dashed {
		stroke-dasharray: 2 5;
	}

	.spinner {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 0;
		height: 0;
		animation-name: spin;
		animation-timing-function: linear;
		animation-iteration-count: infinite;
	}
	.upright {
		width: calc(48 * var(--u));
		height: calc(48 * var(--u));
		animation-name: spin;
		animation-timing-function: linear;
		animation-iteration-count: infinite;
	}
	.paused .spinner,
	.paused .upright {
		animation-play-state: paused;
	}

	.spokes {
		position: absolute;
		left: calc(-340 * var(--u));
		top: calc(-340 * var(--u));
		width: calc(680 * var(--u));
		height: calc(680 * var(--u));
		overflow: visible;
		pointer-events: none;
	}
	.spokes line {
		stroke: var(--brand);
		stroke-width: 1;
		stroke-dasharray: 1 1;
		stroke-dashoffset: 1;
		opacity: 0;
		transition:
			stroke-dashoffset 700ms var(--ez),
			opacity 400ms ease;
	}
	.spokes line.on {
		stroke-dashoffset: 0;
		opacity: 0.7;
	}

	.slot {
		position: absolute;
		width: calc(48 * var(--u));
		height: calc(48 * var(--u));
	}
	.tile {
		position: relative;
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--surface);
		border: 1px solid var(--hair);
		border-radius: calc(4 * var(--u));
		opacity: 0.42;
		transition:
			opacity 400ms ease,
			transform 500ms var(--ez),
			border-color 300ms ease;
	}
	.tile.on {
		opacity: 1;
		transform: scale(1.12);
		border-color: var(--brand);
		box-shadow: 0 0 0 calc(4 * var(--u)) var(--paper);
	}
	.logo {
		display: block;
		width: calc(22 * var(--u));
		height: calc(22 * var(--u));
		fill: var(--ink);
		transition: fill 300ms ease;
	}
	.mark {
		font-family: var(--font-mono);
		font-size: calc(10.5 * var(--u));
		font-weight: 600;
		letter-spacing: 0.02em;
		color: var(--ink);
		transition: color 300ms ease;
	}
	.tile.on .logo {
		fill: var(--brand);
	}
	.tile.on .mark {
		color: var(--brand);
	}
	.tile-label {
		position: absolute;
		top: calc(54 * var(--u));
		left: 50%;
		transform: translateX(-50%);
		white-space: nowrap;
		padding: calc(1 * var(--u)) calc(4 * var(--u));
		background: var(--surface);
		font-family: var(--font-mono);
		font-size: calc(9.5 * var(--u));
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink);
		opacity: 0;
		transition: opacity 300ms ease;
	}
	.tile.on .tile-label {
		opacity: 1;
	}

	.core {
		position: absolute;
		left: calc(256 * var(--u));
		top: calc(302 * var(--u));
		box-sizing: border-box;
		width: calc(168 * var(--u));
		height: calc(76 * var(--u));
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: calc(4 * var(--u));
		padding: calc(10 * var(--u)) calc(14 * var(--u));
		background: var(--surface);
		border: 1.5px solid var(--brand);
		border-radius: 3px;
		outline: 0.75px solid var(--brand);
		outline-offset: -5px;
	}
	.core-num {
		font-family: var(--font-mono);
		font-size: calc(10 * var(--u));
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--brass-text);
	}
	.core-name {
		font-family: var(--font-serif);
		font-size: calc(19 * var(--u));
		line-height: 1.15;
		color: var(--deep);
	}

	.corner {
		position: absolute;
		top: 12px;
		font-family: var(--font-mono);
		font-size: 10.5px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--muted);
	}
	.corner.left {
		left: 14px;
	}
	.corner.right {
		right: 14px;
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.pulse {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--brand);
		animation: pulse-soft 1.6s ease-in-out infinite;
	}
	.pulse.still {
		animation: none;
	}

	.groups li {
		border-top: 1px solid var(--hair);
		transition: border-color 300ms ease;
	}
	.groups li.on {
		border-top-color: var(--ink);
	}
	.groups button {
		display: flex;
		flex-direction: column;
		gap: 6px;
		width: 100%;
		padding: 16px 12px 16px 0;
		background: none;
		border: 0;
		text-align: left;
		cursor: pointer;
		color: var(--ink);
	}
	.g-head {
		display: flex;
		align-items: center;
		gap: 12px;
		line-height: 1.6;
		color: var(--brass-text);
		transition: color 300ms ease;
	}
	.g-head svg {
		flex: none;
	}
	.g-head rect {
		fill: transparent;
		stroke: var(--muted);
		stroke-width: 1.5;
		transition: fill 300ms ease;
	}
	.g-name {
		flex: 1;
	}
	.g-count {
		color: var(--muted);
		letter-spacing: 0.04em;
	}
	.g-items {
		padding-left: 22px;
		font-size: 15.5px;
		line-height: 1.65;
		color: var(--muted);
		text-wrap: pretty;
		transition: color 300ms ease;
	}
	.on .g-head {
		color: var(--brand);
	}
	.on .g-head rect {
		fill: var(--brand);
		stroke: var(--brand);
	}
	.on .g-items {
		color: var(--ink);
	}
</style>
