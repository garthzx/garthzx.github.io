<script lang="ts">
	import { projects } from '$lib/data/projects';
	import { reveal } from '$lib/actions/reveal';
	import Icon from './Icon.svelte';
	import ProjectArt from './ProjectArt.svelte';
</script>

<section id="projects" class="shell scroll-mt-24 py-20 sm:py-28">
	<div class="flex flex-wrap items-end justify-between gap-4" use:reveal>
		<h2 class="section-title">Projects</h2>
		<p class="font-mono text-sm text-ink-faint">
			Academic work &amp; things built for the fun of it
		</p>
	</div>

	<div class="mt-12 grid gap-6 sm:grid-cols-2">
		{#each projects as project, i (project.id)}
			<article
				class="card group flex flex-col overflow-hidden rounded-2xl border border-hairline bg-white/80"
				use:reveal={{ delay: (i % 2) * 90 }}
			>
				<!-- Media -->
				<div class="relative aspect-[16/10] overflow-hidden">
					{#if project.image}
						<img
							src={project.image}
							alt="{project.title} screenshot"
							loading="lazy"
							class="size-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
						/>
					{:else if project.art}
						<div class="placeholder relative grid size-full place-items-center p-4">
							<ProjectArt name={project.art} id={project.id} />
						</div>
					{/if}

					<span
						class="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 font-mono text-xs text-ink-soft backdrop-blur-sm"
						>{project.year}</span
					>

					{#if project.note}
						<span
							class="absolute top-3 right-3 rounded-full bg-brand px-2.5 py-1 font-mono text-xs text-white"
							>{project.note}</span
						>
					{/if}
				</div>

				<!-- Body -->
				<div class="flex flex-1 flex-col p-5">
					<div class="flex items-start justify-between gap-3">
						<h3 class="text-xl font-bold">{project.title}</h3>
						{#if project.link}
							<a
								href={project.link.href}
								target="_blank"
								rel="noreferrer"
								aria-label={project.link.label}
								title={project.link.label}
								class="-m-1.5 shrink-0 rounded-lg p-1.5 text-ink-faint transition-colors hover:bg-brand-tint hover:text-brand"
							>
								<Icon name={project.link.kind === 'paper' ? 'external' : 'github'} size={20} />
							</a>
						{/if}
					</div>

					<p class="mt-1.5 text-sm font-medium text-brand">{project.blurb}</p>
					<p class="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">{project.description}</p>

					<div class="mt-5 flex flex-wrap gap-1.5 border-t border-hairline pt-4">
						{#each project.techUsed as tech (tech)}
							<span
								class="rounded-md border border-mint/70 bg-white px-2 py-1 text-[0.8rem] text-ink-soft"
								>{tech}</span
							>
						{/each}
					</div>
				</div>
			</article>
		{/each}
	</div>
</section>

<style>
	.card {
		box-shadow: 0 4px 12px -8px rgb(82 95 127 / 0.35);
		transition:
			transform 0.35s var(--ease-out-soft),
			box-shadow 0.35s var(--ease-out-soft),
			border-color 0.35s var(--ease-out-soft);
	}

	.card:hover {
		transform: translateY(-5px);
		border-color: color-mix(in srgb, var(--color-brand) 40%, transparent);
		box-shadow: 0 18px 36px -22px rgb(82 95 127 / 0.6);
	}

	.placeholder {
		background:
			radial-gradient(circle at 30% 25%, rgb(116 127 224 / 0.16), transparent 60%),
			linear-gradient(140deg, #f4f5fe 0%, #eceefc 100%);
	}

	.placeholder::before {
		content: '';
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(rgb(116 127 224 / 0.07) 1px, transparent 1px),
			linear-gradient(90deg, rgb(116 127 224 / 0.07) 1px, transparent 1px);
		background-size: 22px 22px;
	}
</style>
