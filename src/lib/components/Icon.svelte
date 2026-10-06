<script lang="ts">
	/** Line icons from the design (20px grid, 1.5 stroke) plus the two brand marks. */
	type Name =
		| 'arrow-right'
		| 'arrow-left'
		| 'download'
		| 'external'
		| 'copy'
		| 'replay'
		| 'theme'
		| 'github'
		| 'linkedin';

	let {
		name,
		size = 16,
		class: klass = ''
	}: { name: Name; size?: number; class?: string } = $props();

	const stroke: Partial<Record<Name, string>> = {
		'arrow-right': 'M3.5 10h12M11 5.5l4.5 4.5-4.5 4.5',
		'arrow-left': 'M16.5 10h-12M9 5.5L4.5 10 9 14.5',
		download: 'M10 3v10M6 9.5l4 4 4-4M4 17h12',
		external: 'M6 14L14 6M7.5 6H14v6.5',
		replay: 'M4 10a6 6 0 1 0 1.8-4.3M4 3.5v3h3'
	};

	const brand: Partial<Record<Name, string>> = {
		github:
			'M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.25 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z',
		linkedin:
			'M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14Zm1.78 13.02H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z'
	};
</script>

{#if brand[name]}
	<svg
		viewBox="0 0 24 24"
		width={size}
		height={size}
		aria-hidden="true"
		focusable="false"
		fill="currentColor"
		class={klass}
	>
		<path d={brand[name]} />
	</svg>
{:else}
	<svg
		viewBox="0 0 20 20"
		width={size}
		height={size}
		aria-hidden="true"
		focusable="false"
		fill="none"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-linecap="square"
		class={klass}
	>
		{#if name === 'copy'}
			<rect x="6.5" y="6.5" width="10" height="10" rx="1" />
			<path d="M3.5 13.5v-10h10" stroke-linecap="butt" />
		{:else if name === 'theme'}
			<circle cx="10" cy="10" r="7" />
			<path d="M10 3a7 7 0 0 1 0 14z" fill="currentColor" stroke="none" />
		{:else}
			<path d={stroke[name]} />
		{/if}
	</svg>
{/if}
