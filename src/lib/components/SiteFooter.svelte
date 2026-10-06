<script lang="ts">
	import { site } from '$lib/data/site';

	let { home = true }: { home?: boolean } = $props();
</script>

<footer class:ruled={!home}>
	<div class="shell row">
		<span>© {new Date().getFullYear()} {site.name}</span>
		{#if home}
			<span
				>Set in Newsreader, IBM Plex Sans &amp; JetBrains Mono · Built with SvelteKit · Hosted on
				GitHub Pages</span
			>
			<a href="#top">Back to top ↑</a>
		{:else}
			<span class="links">
				<a href="mailto:{site.email}">Email</a>
				<a href={site.socials.linkedin}>LinkedIn</a>
				<a href={site.socials.github}>GitHub</a>
			</span>
		{/if}
	</div>
</footer>

<style>
	footer.ruled {
		border-top: 1px solid var(--hair);
	}
	.row {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 12px 32px;
		padding-top: 32px;
		padding-bottom: 40px;
		font-family: var(--font-mono);
		font-size: 11.5px;
		letter-spacing: 0.06em;
		color: var(--muted);
	}
	.links {
		display: flex;
		gap: 20px;
	}
</style>
