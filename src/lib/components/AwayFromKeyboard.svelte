<script lang="ts">
	import { gallery } from '$lib/data/gallery';
	import { reveal } from '$lib/actions/reveal';
</script>

<section class="shell py-20 sm:py-28">
	<div use:reveal>
		<h2 class="section-title">Away from the keyboard</h2>
	</div>

	<div class="mt-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
		<div class="space-y-5 leading-relaxed lg:self-center" use:reveal>
			<p class="text-lg sm:text-xl">
				Step away from the keyboard and you&rsquo;ll usually find me doing one of three things.
			</p>
			<p class="text-ink-soft">
				<span class="font-semibold text-ink">Table tennis</span> is the first — less a sport than an outlet.
				Friendly matches, practice sessions, the fast-paced kind of focus that clears out whatever I was
				stuck on an hour earlier.
			</p>
			<p class="text-ink-soft">
				The second is <span class="font-semibold text-ink">indie music</span>. Guitar in hand, I
				lose a couple of hours to soulful melodies and the odd lyric that only makes sense to me.
			</p>
			<p class="text-ink-soft">
				And the third — <span class="font-semibold text-ink">the beach</span>. My last proper
				getaway was Cebu, and I&rsquo;ve been quietly plotting a way back ever since.
			</p>
		</div>

		<!-- Photo mosaic -->
		<ul
			class="grid auto-rows-[8.5rem] grid-cols-2 gap-3 sm:auto-rows-[9.5rem] sm:grid-cols-4 lg:auto-rows-[10.5rem]"
		>
			{#each gallery as photo, i (photo.id)}
				<li
					class={`tile group relative overflow-hidden rounded-2xl ${photo.span}`}
					use:reveal={{ delay: i * 70 }}
				>
					<img
						src={photo.src}
						alt={photo.alt}
						loading="lazy"
						class={`size-full object-cover ${photo.position ?? 'object-center'} transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]`}
					/>
					<div
						class="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent p-3 pt-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:p-4 sm:pt-12"
					>
						<p class="text-[0.8rem] leading-snug font-medium text-white sm:text-sm">
							{photo.caption}
						</p>
					</div>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	.tile {
		box-shadow: 0 4px 14px -8px rgb(56 4 40 / 0.5);
		transition:
			box-shadow 0.4s var(--ease-out-soft),
			transform 0.4s var(--ease-out-soft);
	}

	.tile:hover {
		transform: translateY(-3px);
		box-shadow: 0 16px 30px -18px rgb(56 4 40 / 0.65);
	}

	/* Captions are hover-revealed on pointer devices; on touch they'd never
	   appear, so pin them open there instead. */
	@media (hover: none) {
		.tile > div {
			opacity: 1;
		}
	}
</style>
