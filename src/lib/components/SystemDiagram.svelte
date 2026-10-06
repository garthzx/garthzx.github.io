<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from './Icon.svelte';
	import { diagrams, type DiagramKind, type Status } from '$lib/data/diagrams';
	import { intro, motionOn } from '$lib/motion.svelte';

	let { kind, minWidth = 720 }: { kind: DiagramKind; minWidth?: number } = $props();

	const uid = $props.id();
	const d = $derived(diagrams[kind]);

	// Timeline, in ms: nodes stagger in, then the happy path draws, then the
	// failure and its compensation play out.
	const happyBase = $derived(120 + d.nodes.length * 55);
	const nHappy = $derived(d.edges.filter((e) => e.k !== 'comp').length);
	const compBase = $derived(happyBase + nHappy * 130 + 350);

	const edges = $derived.by(() => {
		let hj = 0;
		let cj = 0;
		return d.edges.map((e) => {
			const comp = e.k === 'comp';
			const delay = comp ? compBase + cj++ * 200 : happyBase + hj++ * 130;
			const dur = comp ? 380 : 620;
			return {
				...e,
				path: e.p.map(([x, y], j) => `${j ? 'L' : 'M'}${x},${y}`).join(' '),
				delay,
				dur
			};
		});
	});

	const nodeDelay = (i: number, out: boolean) => (out ? happyBase + nHappy * 130 - 100 : i * 55);

	const markerDelay = (st: Status, i: number, out: boolean) =>
		st === 'fail' ? compBase - 200 : st === 'ok' ? happyBase + i * 90 : nodeDelay(i, out) + 200;

	let box: HTMLDivElement;
	let drawn = $state(false);
	let instant = $state(false);
	let visible = $state(false);
	let still = $state(true);
	let replayTimer: ReturnType<typeof setTimeout>;

	onMount(() => {
		still = !motionOn();
		if (still || typeof IntersectionObserver === 'undefined') {
			drawn = true;
			instant = true;
			return;
		}
		const io = new IntersectionObserver(
			(entries) => {
				if (entries.some((e) => e.isIntersecting)) {
					visible = true;
					io.disconnect();
				}
			},
			{ threshold: 0.3 }
		);
		io.observe(box);
		return () => {
			io.disconnect();
			clearTimeout(replayTimer);
		};
	});

	// Draw once it's on screen and the intro curtain is out of the way.
	$effect(() => {
		if (visible && intro.done) drawn = true;
	});

	function replay() {
		drawn = false;
		instant = true;
		clearTimeout(replayTimer);
		replayTimer = setTimeout(() => {
			instant = false;
			drawn = true;
		}, 60);
	}
</script>

<div class="dg-wrap">
	<div class="dg-box" bind:this={box}>
		<svg
			class="dg"
			viewBox="0 0 {d.w} {d.h}"
			role="img"
			aria-label={d.title}
			style:min-width="{minWidth}px"
			data-drawn={drawn ? '' : undefined}
			data-instant={instant ? '' : undefined}
		>
			<title>{d.title}</title>
			<defs>
				{#each ['happy', 'comp', 'ink'] as k (k)}
					<marker
						id="{uid}-{k}"
						viewBox="0 0 10 10"
						refX="9"
						refY="5"
						markerWidth="7"
						markerHeight="7"
						orient="auto-start-reverse"
						markerUnits="userSpaceOnUse"
					>
						<path d="M0,0 L10,5 L0,10 z" class="dg-head-{k}" />
					</marker>
				{/each}
			</defs>

			{#each d.lanes as ln (ln.t)}
				<text x="20" y={ln.y} class="dg-lane">{ln.t.toUpperCase()}</text>
				<line
					x1={20 + ln.t.length * 7.4 + 12}
					y1={ln.y - 3.5}
					x2={d.w - 20}
					y2={ln.y - 3.5}
					class="dg-hair"
				/>
			{/each}

			{#each edges as e, i (i)}
				<g>
					{#if e.k === 'comp'}
						<path
							d={e.path}
							class="dg-line dg-comp dg-fade"
							style="--d:{e.delay}ms;--dur:{e.dur}ms"
						/>
					{:else}
						<path
							d={e.path}
							pathLength="1"
							class="dg-line dg-draw dg-{e.k}"
							style="--d:{e.delay}ms;--dur:{e.dur}ms"
						/>
					{/if}
					<path
						d={e.path}
						marker-end="url(#{uid}-{e.k})"
						class="dg-fade dg-headline"
						style="--d:{e.delay + e.dur - 140}ms;--dur:160ms"
					/>
					{#if e.t}
						<text
							x={e.lx}
							y={e.ly}
							text-anchor={e.a ?? 'middle'}
							class="dg-edge-label dg-fade"
							class:dg-edge-label-comp={e.k === 'comp'}
							style="--d:{e.delay + e.dur * 0.5}ms;--dur:300ms">{e.t}</text
						>
					{/if}
				</g>
			{/each}

			{#each d.nodes as n, i (n.l)}
				{@const out = n.k === 'out'}
				<g class="dg-node" style="--d:{nodeDelay(i, out)}ms">
					<rect
						x={n.x}
						y={n.y}
						width={n.w}
						height={n.h}
						rx="3"
						class="dg-box-{n.k === 'ext' ? 'ext' : 'own'}"
						class:dg-box-out={out}
					/>
					{#if n.k === 'store'}
						<line x1={n.x} y1={n.y + 7} x2={n.x + n.w} y2={n.y + 7} class="dg-store-rule" />
					{/if}
					{#if out}
						<rect
							x={n.x + 3.5}
							y={n.y + 3.5}
							width={n.w - 7}
							height={n.h - 7}
							rx="1.5"
							class="dg-out-inner"
						/>
					{/if}
					<text x={n.x + 14} y={n.y + 26} class="dg-node-label" class:dg-node-label-out={out}
						>{n.l.toUpperCase()}</text
					>
					<text x={n.x + 14} y={n.y + 44} class="dg-node-sub">{n.s}</text>
					{#if n.st}
						{@const cx = n.x + n.w - 13}
						{@const cy = n.y + 13}
						<g class="dg-mark" style="--d:{markerDelay(n.st, i, out)}ms">
							{#if n.st === 'ok'}
								<circle {cx} {cy} r="4" class="dg-ok" />
							{:else if n.st === 'fail'}
								<rect
									x={cx - 3.5}
									y={cy - 3.5}
									width="7"
									height="7"
									transform="rotate(45 {cx} {cy})"
									class="dg-fail"
								/>
							{:else}
								<circle {cx} {cy} r="3.5" class="dg-idle" />
							{/if}
						</g>
					{/if}
				</g>
			{/each}

			{#each d.notes as note (note.t)}
				<text x={note.x} y={note.y} text-anchor={note.a ?? 'start'} class="dg-note">{note.t}</text>
			{/each}
		</svg>
	</div>
	{#if !still}
		<button type="button" class="dg-replay" onclick={replay} aria-label="Replay diagram animation">
			<Icon name="replay" size={12} />Replay
		</button>
	{/if}
</div>

<style>
	.dg-wrap {
		position: relative;
		display: flex;
		flex-direction: column;
		width: 100%;
	}
	.dg-box {
		width: 100%;
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
	}
	.dg {
		display: block;
		width: 100%;
		height: auto;
		background: var(--surface);
		font-family: var(--font-mono);
	}

	/* Static styling */
	.dg-lane {
		font-size: 10px;
		letter-spacing: 0.14em;
		fill: var(--muted);
	}
	.dg-hair {
		stroke: var(--hair);
		stroke-width: 1;
	}
	.dg-line {
		fill: none;
		stroke-linejoin: round;
		stroke-width: 1.5;
	}
	.dg-happy {
		stroke: var(--brand);
	}
	.dg-ink {
		stroke: var(--ink);
		stroke-width: 1.25;
	}
	.dg-comp {
		stroke: var(--brass);
		stroke-dasharray: 5 4;
	}
	.dg-headline {
		fill: none;
		stroke: none;
	}
	.dg-head-happy {
		fill: var(--brand);
	}
	.dg-head-comp {
		fill: var(--brass);
	}
	.dg-head-ink {
		fill: var(--ink);
	}
	.dg-edge-label {
		font-size: 10px;
		letter-spacing: 0.04em;
		fill: var(--muted);
		paint-order: stroke;
		stroke: var(--surface);
		stroke-width: 5;
		stroke-linejoin: round;
	}
	.dg-edge-label-comp {
		fill: var(--brass-text);
	}
	.dg-box-own,
	.dg-box-ext {
		fill: var(--surface);
		stroke: var(--ink);
		stroke-width: 1.5;
	}
	.dg-box-ext {
		fill: var(--tint);
	}
	.dg-box-out {
		stroke: var(--brand);
	}
	.dg-store-rule {
		stroke: var(--ink);
		stroke-width: 1;
	}
	.dg-out-inner {
		fill: none;
		stroke: var(--brand);
		stroke-width: 0.75;
	}
	.dg-node-label {
		font-size: 11.5px;
		font-weight: 600;
		letter-spacing: 0.06em;
		fill: var(--ink);
	}
	.dg-node-label-out {
		fill: var(--brand);
	}
	.dg-node-sub {
		font-size: 10.5px;
		fill: var(--muted);
	}
	.dg-ok {
		fill: var(--brand);
	}
	.dg-fail {
		fill: var(--brass);
	}
	.dg-idle {
		fill: none;
		stroke: var(--muted);
		stroke-width: 1.25;
	}
	.dg-note {
		font-size: 10px;
		font-style: italic;
		fill: var(--brass-text);
	}

	/* Animation. Hidden only when motion is on and the diagram hasn't drawn,
	   so without JS (or with reduced motion) it simply renders complete. */
	.dg-node {
		transition:
			opacity 520ms var(--ez) var(--d),
			transform 520ms var(--ez) var(--d);
	}
	.dg-draw {
		stroke-dasharray: 1 1;
		stroke-dashoffset: 0;
		transition: stroke-dashoffset var(--dur) var(--ez) var(--d);
	}
	.dg-fade {
		transition: opacity var(--dur) var(--ez) var(--d);
	}
	.dg-mark {
		transform-box: fill-box;
		transform-origin: center;
		transition: transform 360ms var(--ez) var(--d);
	}
	.dg[data-drawn]:not([data-instant]) .dg-comp {
		animation: dg-march 1.1s linear var(--d) 3;
	}

	:global(html[data-motion='on']) .dg:not([data-drawn]) .dg-node {
		opacity: 0;
		transform: translateY(6px);
	}
	:global(html[data-motion='on']) .dg:not([data-drawn]) .dg-draw {
		stroke-dashoffset: 1;
	}
	:global(html[data-motion='on']) .dg:not([data-drawn]) .dg-fade {
		opacity: 0;
	}
	:global(html[data-motion='on']) .dg:not([data-drawn]) .dg-mark {
		transform: scale(0);
	}

	.dg[data-instant] * {
		transition: none !important;
		animation: none !important;
	}

	@keyframes dg-march {
		to {
			stroke-dashoffset: -27;
		}
	}

	.dg-replay {
		display: flex;
		align-items: center;
		gap: 6px;
		min-height: 32px;
		margin: 8px 0 0 auto;
		padding: 0 10px;
		background: var(--surface);
		border: 1px solid var(--hair);
		border-radius: 4px;
		color: var(--muted);
		cursor: pointer;
		font-family: var(--font-mono);
		font-size: 10.5px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}
	.dg-replay:hover {
		border-color: var(--brand);
		color: var(--brand);
	}
</style>
