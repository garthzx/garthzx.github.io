<script lang="ts">
	import { blocks, user, host, type OutputLine } from '$lib/data/terminal';

	type Step =
		{ type: 'command'; cwd: string; command: string } | { type: 'output'; lines: OutputLine[] };

	const steps: Step[] = blocks.flatMap((b) => {
		const out: Step[] = [{ type: 'command', cwd: b.cwd, command: b.command }];
		if (b.output) out.push({ type: 'output', lines: b.output });
		return out;
	});

	let shown = $state(0);
	let done = $derived(shown >= steps.length);

	/** Plays the sequence once the terminal scrolls into view. */
	function play(node: HTMLElement) {
		const reduced =
			typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

		if (reduced || typeof IntersectionObserver === 'undefined') {
			shown = steps.length;
			return {};
		}

		let timer: ReturnType<typeof setTimeout>;

		const advance = () => {
			if (shown >= steps.length) return;
			shown += 1;
			const next = steps[shown];
			timer = setTimeout(advance, next?.type === 'output' ? 340 : 260);
		};

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					observer.disconnect();
					timer = setTimeout(advance, 350);
				}
			},
			{ threshold: 0.25 }
		);
		observer.observe(node);

		return {
			destroy() {
				clearTimeout(timer);
				observer.disconnect();
			}
		};
	}

	function skip() {
		shown = steps.length;
	}
</script>

<div
	class="terminal-frame overflow-hidden rounded-xl"
	use:play
	role="img"
	aria-label="Terminal window listing Garth's details: who he is, where he works, his education, and how to reach him."
>
	<!-- Title bar -->
	<div class="titlebar flex h-11 items-center gap-2 px-3">
		<span class="dot dot--exit"></span>
		<span class="dot"></span>
		<span class="dot"></span>
		<p class="ml-2 truncate font-ubuntu text-sm text-[#d5d0ce]">
			{user}@{host}: ~
		</p>
		{#if !done}
			<button
				type="button"
				onclick={skip}
				class="ml-auto rounded px-2 py-1 font-mono text-[0.7rem] tracking-wide text-[#d5d0ce]/70 transition-colors hover:bg-white/10 hover:text-white"
			>
				skip
			</button>
		{/if}
	</div>

	<!-- Body -->
	<section
		class="terminal-body max-h-[26rem] overflow-y-auto px-3 py-3 font-term text-[1.05rem] leading-relaxed sm:max-h-none sm:px-4 sm:text-[1.15rem]"
	>
		{#each steps as step, i (i)}
			{#if step.type === 'command'}
				<div
					class="step mt-2 flex flex-wrap items-baseline gap-x-1.5 first:mt-0"
					class:step--on={i < shown}
				>
					<span class="text-[#7eda28]">{user}@{host}:</span><span class="text-[#4878c0]"
						>{step.cwd}</span
					>
					<span class="text-[#dddddd]">$</span>
					<span class="text-[#dddddd]">{step.command}</span>
				</div>
			{:else}
				<div class="step mt-1 mb-3 flex flex-col" class:step--on={i < shown}>
					{#each step.lines as line, j (j)}
						{#if line.kind === 'brace'}
							<span class="text-[#f8f8ff]/80">{line.text}</span>
						{:else if line.kind === 'plain'}
							<span class="pl-4 text-[#f8f8ff]">{line.text}</span>
						{:else}
							<span class="flex flex-wrap items-baseline pl-4">
								<span class="text-[#f8f8ff]">{line.key}&nbsp;</span>
								<span class="text-[#f8f8ff]/60">:&nbsp;</span>
								{#if line.href}
									<a
										href={line.href}
										target={line.href.startsWith('http') ? '_blank' : undefined}
										rel="noreferrer"
										class="text-[#61d6d6] underline decoration-[#61d6d6]/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
										>"{line.value}"</a
									>
								{:else}
									<span class="text-[#61d6d6]">"{line.value}"</span>
								{/if}
								{#if !line.last}<span class="text-[#f8f8ff]/60">,</span>{/if}
							</span>
						{/if}
					{/each}
				</div>
			{/if}
		{/each}

		<!-- Live prompt with the blinking block cursor -->
		<div class="step mt-2 flex items-center gap-x-1.5" class:step--on={done}>
			<span class="text-[#7eda28]">{user}@{host}:</span><span class="text-[#4878c0]">~/garth</span>
			<span class="text-[#dddddd]">$</span>
			<span class="cursor"></span>
		</div>
	</section>
</div>

<style>
	.terminal-frame {
		box-shadow:
			0 2px 4px rgb(56 4 40 / 0.16),
			0 18px 40px -18px rgb(56 4 40 / 0.55);
	}

	.titlebar {
		background: linear-gradient(#504b45 0%, #3c3b37 100%);
	}

	.dot {
		height: 0.75rem;
		width: 0.75rem;
		border-radius: 9999px;
		background: linear-gradient(#7d7871 0%, #595953 100%);
		box-shadow:
			0 0 1px 0 #41403a,
			0 1px 1px 0 #474642;
	}

	.dot--exit {
		background: linear-gradient(#f37458 0%, #de4c12 100%);
	}

	/* Every line stays in the DOM so the panel never changes height while the
	   sequence plays — and so the content is there for assistive tech. */
	.step {
		opacity: 0;
		transition: opacity 0.18s linear;
	}

	.step--on {
		opacity: 1;
	}

	.terminal-body {
		background: rgb(56 4 40 / 0.94);
		scrollbar-width: thin;
		scrollbar-color: rgb(248 248 255 / 0.25) transparent;
	}

	.terminal-body::-webkit-scrollbar {
		width: 8px;
	}
	.terminal-body::-webkit-scrollbar-thumb {
		background: rgb(248 248 255 / 0.2);
		border-radius: 9999px;
	}

	.cursor {
		display: inline-block;
		height: 1.05em;
		width: 0.5rem;
		translate: 0 0.12em;
		background: #ffffff;
		animation: blink 1.2s steps(1, end) infinite;
	}

	@keyframes blink {
		0%,
		55% {
			background: #ffffff;
		}
		56%,
		100% {
			background: transparent;
		}
	}
</style>
