<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from './Icon.svelte';
	import me from '$lib/assets/me.jpg';
	import { site, nav } from '$lib/data/site';

	let active = $state('');
	let stuck = $state(false);
	let sentinel: HTMLDivElement;

	const socials = [
		{ name: 'github', href: site.socials.github, label: 'GitHub' },
		{ name: 'linkedin', href: site.socials.linkedin, label: 'LinkedIn' }
	] as const;

	onMount(() => {
		const sections = nav
			.map((item) => document.querySelector(item.href))
			.filter((el): el is Element => el !== null);

		const spy = new IntersectionObserver(
			(entries) => {
				const visible = entries
					.filter((e) => e.isIntersecting)
					.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
				if (visible) active = `#${visible.target.id}`;
			},
			{ rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.25, 0.5] }
		);
		sections.forEach((s) => spy.observe(s));

		const stick = new IntersectionObserver(([entry]) => (stuck = !entry.isIntersecting), {
			threshold: 1
		});
		if (sentinel) stick.observe(sentinel);

		return () => {
			spy.disconnect();
			stick.disconnect();
		};
	});
</script>

<header class="shell pt-8 sm:pt-12">
	<div class="flex flex-col-reverse items-start gap-6 sm:flex-row sm:items-center sm:gap-8">
		<a href="#top" class="group flex min-w-0 items-baseline">
			<span
				class="font-mono text-[clamp(1.9rem,1.1rem+3.6vw,3.2rem)] leading-none font-black text-brand"
				aria-hidden="true">&gt;&nbsp;</span
			>
			<span
				class="typewriter font-mono text-[clamp(1.9rem,1.1rem+3.6vw,3.2rem)] leading-none font-black tracking-[0.03em] text-brand"
			>
				{site.name}
			</span>
		</a>

		<div class="sm:ml-auto">
			<img
				src={me}
				alt="Garth Dustin Ayang-ang"
				width="64"
				height="64"
				class="size-14 rounded-full border border-brand object-cover ring-4 ring-brand/15 sm:size-16"
			/>
		</div>
	</div>

	<p class="mt-5 max-w-2xl text-base text-ink-soft sm:text-lg">
		{site.role} — {site.focus}. Currently at
		<a
			href={site.company.href}
			target="_blank"
			rel="noreferrer"
			class="underline-swipe font-medium text-brand">{site.company.name}</a
		>.
	</p>
</header>

<div bind:this={sentinel} aria-hidden="true"></div>

<div class="navbar sticky top-0 z-50 mt-8" class:is-stuck={stuck}>
	<div class="border-y border-hairline bg-canvas/85 backdrop-blur-md">
		<nav class="shell flex flex-col gap-2 py-1 sm:flex-row sm:items-center sm:justify-between">
			<ul
				class="-mx-1 flex [scrollbar-width:none] items-center gap-1 overflow-x-auto sm:mx-0 sm:gap-4 [&::-webkit-scrollbar]:hidden"
			>
				{#each nav as item (item.href)}
					<li>
						<a
							href={item.href}
							class="underline-swipe relative block shrink-0 px-2 py-3 text-[0.95rem] font-medium whitespace-nowrap transition-colors hover:text-brand sm:px-3 sm:text-lg"
							class:text-brand={active === item.href}
							aria-current={active === item.href ? 'true' : undefined}
						>
							{item.label}
							{#if active === item.href}
								<span class="absolute inset-x-2 bottom-1 h-[3px] rounded-full bg-brand sm:inset-x-3"
								></span>
							{/if}
						</a>
					</li>
				{/each}
			</ul>

			<div class="flex items-center gap-1 border-t border-hairline py-2 sm:border-t-0 sm:py-0">
				{#each socials as s (s.name)}
					<a
						href={s.href}
						target="_blank"
						rel="noreferrer"
						aria-label={s.label}
						class="rounded-lg p-2.5 text-ink-soft transition-colors hover:bg-brand-tint hover:text-brand"
					>
						<Icon name={s.name} size={19} />
					</a>
				{/each}
			</div>
		</nav>
	</div>
</div>

<style>
	.navbar {
		transition: box-shadow 0.3s ease;
	}

	.navbar.is-stuck {
		box-shadow: 0 10px 24px -20px rgb(82 95 127 / 0.55);
	}

	.typewriter {
		display: inline-block;
		overflow: hidden;
		white-space: nowrap;
		border-right: 0.32em solid rgb(116 127 224 / 0.65);
		width: 0;
		animation:
			typing 1.1s steps(14, end) 0.35s forwards,
			blink-caret 0.8s step-end infinite;
	}

	@keyframes typing {
		to {
			width: 100%;
		}
	}

	@keyframes blink-caret {
		from,
		to {
			border-color: transparent;
		}
		50% {
			border-color: rgb(116 127 224 / 0.65);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.typewriter {
			width: auto;
			animation: none;
			border-right-color: transparent;
		}
	}
</style>
