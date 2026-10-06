<script lang="ts">
	import { onMount } from 'svelte';
	import { site } from '$lib/data/site';
	import { finishIntro } from '$lib/motion.svelte';
	import portrait from '$lib/assets/me.jpg';

	const STEPS = ['Typesetting', 'Developing photographs', 'Drawing systems'];
	const words = site.name.split(' ');

	let phase = $state<'run' | 'exit' | 'gone'>('run');
	let active = $state(false);
	let risen = $state(false);
	let ready = $state([false, false, false]);

	let progress = $state(0);
	const count = $derived(String(Math.round(progress * 100)).padStart(3, '0'));

	let raf = 0;
	let timers: ReturnType<typeof setTimeout>[] = [];
	const later = (fn: () => void, ms: number) => timers.push(setTimeout(fn, ms));

	function exit() {
		if (phase !== 'run') return;
		cancelAnimationFrame(raf);
		phase = 'exit';
		later(finishIntro, 380);
		later(() => {
			document.body.style.overflow = '';
			phase = 'gone';
		}, 1050);
	}

	onMount(() => {
		if (document.documentElement.dataset.intro !== 'run') {
			phase = 'gone';
			return;
		}
		active = true;
		document.body.style.overflow = 'hidden';
		requestAnimationFrame(() => requestAnimationFrame(() => (risen = true)));

		const mark = (i: number) => {
			if (!ready[i]) ready[i] = true;
		};
		(document.fonts?.ready ?? Promise.resolve()).then(() => later(() => mark(0), 350));
		const img = new Image();
		img.onload = img.onerror = () => later(() => mark(1), 700);
		img.src = portrait;
		const loaded = () => later(() => mark(2), 1050);
		if (document.readyState === 'complete') loaded();
		else addEventListener('load', loaded, { once: true });
		later(() => [0, 1, 2].forEach(mark), 4500);

		// The counter eases toward a target that only reaches 100 once every
		// step has reported in, and never in under 1.7s.
		const t0 = performance.now();
		const tick = (now: number) => {
			const done = ready.filter(Boolean).length;
			const tMin = Math.min(1, (now - t0) / 1700);
			const target = done === 3 ? tMin : Math.min(tMin, 0.82 + done * 0.04);
			let next = progress + (target - progress) * 0.12;
			if (target === 1 && next > 0.996) next = 1;
			progress = next;
			if (next < 1) raf = requestAnimationFrame(tick);
			else later(exit, 320);
		};
		raf = requestAnimationFrame(tick);

		return () => {
			cancelAnimationFrame(raf);
			timers.forEach(clearTimeout);
			removeEventListener('load', loaded);
			document.body.style.overflow = '';
		};
	});
</script>

{#if phase !== 'gone'}
	<div
		class="loader"
		class:active
		class:exit={phase === 'exit'}
		data-theme="dark"
		role="status"
		aria-label="Loading portfolio"
	>
		<div class="frame">
			<div class="top mono-label">
				<span><span class="brass">{site.initials}</span> · Portfolio</span>
				<span>{site.city}, {site.countryCode}</span>
			</div>

			<div class="middle">
				<div aria-hidden="true" class="name">
					{#each words as word, i (word)}
						<span class="clip">
							<span
								class="word"
								class:italic={i === words.length - 1}
								class:risen
								style:transition-delay="{80 + i * 100}ms">{word}</span
							>
						</span>
					{/each}
				</div>
				<div class="meter">
					<div aria-hidden="true" class="track">
						<div class="fill" style:transform="scaleX({progress})"></div>
					</div>
					<span class="count">{count}</span>
				</div>
			</div>

			<div class="bottom">
				<ol class="steps mono-label">
					{#each STEPS as label, i (label)}
						<li class:ok={ready[i]}>
							<span aria-hidden="true" class="dot"></span>
							<span class="brass">0{i + 1}</span>{label}
						</li>
					{/each}
				</ol>
				<button type="button" class="skip" onclick={exit}>Skip intro</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.loader {
		display: none;
		position: fixed;
		inset: 0;
		z-index: 200;
		background: var(--paper);
		color: var(--ink);
		transition: transform 1000ms cubic-bezier(0.76, 0, 0.24, 1);
		will-change: transform;
	}
	/* Visible from first paint when app.html scheduled the intro, and kept
	   visible by the component once it takes over. */
	:global(html[data-intro='run']) .loader,
	.loader.active {
		display: block;
	}
	.loader.exit {
		transform: translateY(-100%);
	}

	.frame {
		box-sizing: border-box;
		height: 100%;
		display: grid;
		grid-template-rows: auto minmax(0, 1fr) auto;
		padding: clamp(20px, 4vw, 40px) clamp(20px, 5vw, 64px);
		transition:
			opacity 450ms var(--ez),
			transform 700ms var(--ez);
	}
	.exit .frame {
		opacity: 0;
		transform: translateY(-28px);
	}

	.top {
		display: flex;
		justify-content: space-between;
		gap: 16px;
		font-size: 11.5px;
		color: var(--muted);
	}
	.brass {
		color: var(--brass-text);
	}

	.middle {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: clamp(24px, 4vw, 40px);
		width: 100%;
		max-width: 1072px;
		margin: 0 auto;
	}
	.name {
		display: flex;
		flex-wrap: wrap;
		gap: 0 0.28em;
		font-family: var(--font-serif);
		font-weight: 400;
		font-size: clamp(48px, 9vw, 128px);
		line-height: 1;
		letter-spacing: -0.025em;
		color: var(--deep);
		font-variation-settings: 'opsz' 72;
	}
	.clip {
		display: inline-block;
		overflow: hidden;
		padding-bottom: 0.1em;
	}
	.word {
		display: inline-block;
		transform: translateY(110%);
		transition: transform 1100ms var(--ez);
	}
	.word.risen {
		transform: none;
	}
	.word.italic {
		font-style: italic;
		color: var(--brand);
	}

	.meter {
		display: flex;
		align-items: center;
		gap: 20px;
	}
	.track {
		position: relative;
		flex: 1;
		height: 1px;
		background: var(--hair);
		overflow: hidden;
	}
	.fill {
		position: absolute;
		inset: 0;
		background: var(--brand);
		transform-origin: left center;
	}
	.count {
		min-width: 3.2em;
		text-align: right;
		font-family: var(--font-mono);
		font-size: 13px;
		letter-spacing: 0.08em;
	}

	.bottom {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: 12px 32px;
	}
	.steps {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 24px;
		margin: 0;
		padding: 0;
		list-style: none;
		font-size: 11.5px;
		letter-spacing: 0.1em;
	}
	.steps li {
		display: flex;
		align-items: center;
		gap: 10px;
		color: var(--muted);
		transition: color 300ms ease;
	}
	.steps li.ok {
		color: var(--ink);
	}
	.dot {
		box-sizing: border-box;
		width: 7px;
		height: 7px;
		border-radius: 50%;
		border: 1.25px solid var(--muted);
		animation: pulse-soft 1.2s ease-in-out infinite;
		transition:
			background-color 300ms ease,
			border-color 300ms ease;
	}
	.ok .dot {
		border-color: var(--brand);
		background: var(--brand);
		animation: none;
	}

	.skip {
		display: flex;
		align-items: center;
		min-height: 40px;
		padding: 0 12px;
		background: none;
		border: 1px solid var(--hair);
		border-radius: 4px;
		color: var(--muted);
		cursor: pointer;
		font-family: var(--font-mono);
		font-size: 11px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}
	.skip:hover {
		color: var(--brand);
		border-color: var(--brand);
	}
</style>
