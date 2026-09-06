<script lang="ts">
	/**
	 * Vector artwork for the projects that have no screenshot. Drawn in the site
	 * palette so the cards read as one set alongside the real screenshots.
	 */
	export type ArtName = 'retina' | 'scoreboard';

	let { name, id }: { name: ArtName; id: string } = $props();

	// Gradient ids have to be unique per instance or the first one wins.
	const gid = $derived(`art-${id}`);
</script>

<svg
	viewBox="0 0 320 200"
	class="art size-full"
	role="presentation"
	aria-hidden="true"
	fill="none"
	stroke-linecap="round"
	stroke-linejoin="round"
>
	{#if name === 'retina'}
		<!-- Multi-label retinal disease classification: a fundus image on the left,
		     per-label confidence bars on the right. -->
		<defs>
			<radialGradient id="{gid}-fundus" cx="42%" cy="38%" r="72%">
				<stop offset="0%" stop-color="var(--color-brand)" stop-opacity="0.20" />
				<stop offset="100%" stop-color="var(--color-brand)" stop-opacity="0.06" />
			</radialGradient>
			<clipPath id="{gid}-clip">
				<circle cx="100" cy="100" r="60" />
			</clipPath>
		</defs>

		<circle
			cx="100"
			cy="100"
			r="60"
			fill="url(#{gid}-fundus)"
			stroke="var(--color-brand)"
			stroke-opacity="0.45"
			stroke-width="2"
		/>

		<g clip-path="url(#{gid}-clip)">
			<!-- Vessels: two trunks leaving the optic disc and branching away from
			     it. All on one side, so the circle reads as a fundus rather than a
			     symmetrical wheel. -->
			<g stroke="var(--color-brand)" fill="none" stroke-opacity="0.65">
				<path d="M119 80C105 67 93 59 79 55" stroke-width="4.2" />
				<path d="M121 98C109 116 97 131 82 139" stroke-width="4.2" />
			</g>
			<g stroke="var(--color-brand)" fill="none" stroke-opacity="0.5">
				<path d="M93 59C87 49 81 42 73 36" stroke-width="2.6" />
				<path d="M79 55C69 55 59 57 49 62" stroke-width="2.6" />
				<path d="M97 131C95 142 92 151 88 159" stroke-width="2.6" />
				<path d="M82 139C72 142 62 143 52 141" stroke-width="2.6" />
			</g>
			<g stroke="var(--color-brand)" fill="none" stroke-opacity="0.32">
				<path d="M61 58C56 51 52 46 47 41" stroke-width="1.5" />
				<path d="M62 143C58 150 55 155 52 161" stroke-width="1.5" />
			</g>
		</g>

		<!-- Optic disc -->
		<circle cx="127" cy="89" r="12" fill="var(--color-brand)" fill-opacity="0.45" />
		<circle
			cx="127"
			cy="89"
			r="12"
			stroke="var(--color-brand)"
			stroke-opacity="0.9"
			stroke-width="2.4"
		/>

		<!-- Detection frame around the scan -->
		<g stroke="var(--color-brand)" stroke-opacity="0.4" stroke-width="2.6" fill="none">
			<path d="M36 52V36h16" />
			<path d="M148 36h16v16" />
			<path d="M164 148v16h-16" />
			<path d="M52 164H36v-16" />
		</g>

		<!-- The lesion the model has flagged -->
		<rect
			x="52"
			y="88"
			width="34"
			height="34"
			rx="5"
			stroke="var(--color-mint)"
			stroke-width="2.6"
			stroke-dasharray="6 4"
		/>
		<circle cx="69" cy="105" r="8" fill="var(--color-mint)" />
		<circle cx="104" cy="136" r="4.5" fill="var(--color-mint)" fill-opacity="0.7" />

		<!-- Label confidences -->
		{#each [{ y: 66, w: 92, c: 'var(--color-brand)' }, { y: 100, w: 64, c: 'var(--color-brand)' }, { y: 134, w: 34, c: 'var(--color-ink-faint)' }] as row, i (i)}
			<rect x="190" y={row.y - 7} width="9" height="9" rx="2.5" fill={row.c} fill-opacity="0.8" />
			<rect
				x="206"
				y={row.y - 6}
				width={i === 0 ? 54 : 42}
				height="7"
				rx="3.5"
				fill="var(--color-ink-faint)"
				fill-opacity="0.35"
			/>
			<rect
				x="190"
				y={row.y + 8}
				width="104"
				height="7"
				rx="3.5"
				fill={row.c}
				fill-opacity="0.16"
			/>
			<rect x="190" y={row.y + 8} width={row.w} height="7" rx="3.5" fill={row.c} />
		{/each}
	{:else}
		<!-- iSkor: an event tabulation panel with ranked entries. -->
		<rect
			x="40"
			y="32"
			width="240"
			height="136"
			rx="12"
			fill="#ffffff"
			fill-opacity="0.9"
			stroke="var(--color-brand)"
			stroke-opacity="0.35"
			stroke-width="2"
		/>

		<!-- Header -->
		<rect x="58" y="48" width="76" height="9" rx="4.5" fill="var(--color-brand)" />
		<rect
			x="58"
			y="63"
			width="46"
			height="6"
			rx="3"
			fill="var(--color-ink-faint)"
			fill-opacity="0.35"
		/>
		<path
			d="M250 44l3.6 7.4 8.1 1.2-5.9 5.7 1.4 8.1-7.2-3.8-7.2 3.8 1.4-8.1-5.9-5.7 8.1-1.2z"
			fill="var(--color-mint)"
		/>
		<line
			x1="58"
			y1="82"
			x2="262"
			y2="82"
			stroke="var(--color-brand)"
			stroke-opacity="0.2"
			stroke-width="2"
		/>

		<!-- Ranked rows -->
		{#each [{ y: 102, name: 68, score: 92, lead: true }, { y: 126, name: 56, score: 68, lead: false }, { y: 150, name: 62, score: 46, lead: false }] as row, i (i)}
			<circle
				cx="70"
				cy={row.y}
				r="11"
				fill={row.lead ? 'var(--color-mint)' : 'var(--color-brand)'}
				fill-opacity={row.lead ? '0.9' : '0.14'}
			/>
			<text
				x="70"
				y={row.y + 4}
				text-anchor="middle"
				font-family="ui-monospace, SFMono-Regular, Menlo, monospace"
				font-size="12"
				font-weight="700"
				fill={row.lead ? '#2c5f47' : 'var(--color-brand)'}>{i + 1}</text
			>
			<rect
				x="90"
				y={row.y - 4}
				width={row.name}
				height="8"
				rx="4"
				fill="var(--color-ink-faint)"
				fill-opacity="0.32"
			/>
			<rect
				x="168"
				y={row.y - 4}
				width="94"
				height="8"
				rx="4"
				fill="var(--color-brand)"
				fill-opacity="0.14"
			/>
			<rect
				x="168"
				y={row.y - 4}
				width={row.score}
				height="8"
				rx="4"
				fill={row.lead ? 'var(--color-mint)' : 'var(--color-brand)'}
				fill-opacity={row.lead ? '1' : '0.75'}
			/>
		{/each}
	{/if}
</svg>

<style>
	.art {
		transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
	}

	:global(.group:hover) .art {
		transform: scale(1.05);
	}

	@media (prefers-reduced-motion: reduce) {
		.art {
			transition: none;
		}
		:global(.group:hover) .art {
			transform: none;
		}
	}
</style>
