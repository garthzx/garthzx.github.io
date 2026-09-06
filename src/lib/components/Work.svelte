<script lang="ts">
	import { experience } from '$lib/data/experience';
	import { reveal } from '$lib/actions/reveal';
	import Icon from './Icon.svelte';

	const COLLAPSED = 3;
	let expanded = $state<Record<string, boolean>>({});

	const toggle = (id: string) => (expanded[id] = !expanded[id]);
</script>

<section id="work" class="shell scroll-mt-24 py-20 sm:py-28">
	<div class="flex flex-wrap items-end justify-between gap-4" use:reveal>
		<h2 class="section-title">Experience</h2>
		<p class="font-mono text-sm text-ink-faint">3+ years shipping production systems</p>
	</div>

	<ol class="mt-12 space-y-10">
		{#each experience as role, i (role.id)}
			{@const isOpen = expanded[role.id]}
			{@const visible = isOpen ? role.highlights : role.highlights.slice(0, COLLAPSED)}
			<li class="relative pl-7 sm:pl-10" use:reveal={{ delay: i * 90 }}>
				<!-- Timeline rail + node -->
				<span
					class="absolute top-3 bottom-0 left-[7px] w-px bg-hairline sm:left-[11px]"
					class:hidden={i === experience.length - 1}
					aria-hidden="true"
				></span>
				<span
					class="absolute top-2 left-0 grid size-[15px] place-items-center rounded-full sm:size-[23px]"
					class:bg-brand={role.current}
					class:bg-hairline={!role.current}
					aria-hidden="true"
				>
					<span
						class="size-[7px] rounded-full bg-white sm:size-[9px]"
						class:animate-ping={role.current}
					></span>
				</span>

				<article class="rounded-2xl border border-hairline bg-white/70 p-5 sm:p-7">
					<header class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
						<h3 class="text-xl font-bold sm:text-2xl">
							{#if role.href}
								<a
									href={role.href}
									target="_blank"
									rel="noreferrer"
									class="inline-flex items-center gap-1.5 transition-colors hover:text-brand"
								>
									{role.company}
									<Icon name="external" size={15} class="text-ink-faint" />
								</a>
							{:else}
								{role.company}
							{/if}
						</h3>
						{#if role.current}
							<span
								class="rounded-full bg-brand-tint px-2.5 py-0.5 font-mono text-[0.7rem] font-semibold tracking-wide text-brand uppercase"
								>Current</span
							>
						{/if}
					</header>

					<p class="mt-1 font-medium text-brand">{role.title}</p>
					<p class="mt-1 font-mono text-sm text-ink-faint">
						{role.period} &nbsp;·&nbsp; {role.location}
					</p>

					<p class="mt-4 leading-relaxed text-ink-soft">{role.summary}</p>

					<ul class="mt-5 space-y-3">
						{#each visible as point (point)}
							<li class="flex gap-3 leading-relaxed">
								<span class="mt-[0.45em] size-1.5 shrink-0 rounded-full bg-current text-brand"
								></span>
								<span class="text-[0.97rem]">{point}</span>
							</li>
						{/each}
					</ul>

					{#if role.highlights.length > COLLAPSED}
						<button
							type="button"
							onclick={() => toggle(role.id)}
							class="mt-4 inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-semibold text-brand transition-colors hover:bg-brand-tint"
							aria-expanded={isOpen}
						>
							{isOpen ? 'Show less' : `Show ${role.highlights.length - COLLAPSED} more`}
							<span class="chevron" class:up={isOpen} aria-hidden="true">↓</span>
						</button>
					{/if}

					<div class="mt-5 flex flex-wrap gap-1.5 border-t border-hairline pt-5">
						{#each role.stack as tech (tech)}
							<span
								class="rounded-md border border-mint/70 bg-white px-2 py-1 text-[0.8rem] text-ink-soft"
								>{tech}</span
							>
						{/each}
					</div>
				</article>
			</li>
		{/each}
	</ol>
</section>

<style>
	.chevron {
		display: inline-block;
		transition: rotate 0.25s var(--ease-out-soft);
	}
	.chevron.up {
		rotate: 180deg;
	}
</style>
