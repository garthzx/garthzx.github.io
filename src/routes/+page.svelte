<script lang="ts">
	import Loader from '$lib/components/Loader.svelte';
	import SiteHeader from '$lib/components/SiteHeader.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import Systems from '$lib/components/Systems.svelte';
	import Experience from '$lib/components/Experience.svelte';
	import Projects from '$lib/components/Projects.svelte';
	import Toolkit from '$lib/components/Toolkit.svelte';
	import Recognition from '$lib/components/Recognition.svelte';
	import Trips from '$lib/components/Trips.svelte';
	import Contact from '$lib/components/Contact.svelte';
	import SiteFooter from '$lib/components/SiteFooter.svelte';
	import { site } from '$lib/data/site';

	const title = `${site.name} — ${site.role}`;
	const description = `${site.name} — ${site.role} focused on backend architecture, third-party API integration, and business process automation. Currently at ${site.company.name}.`;
	const ogAlt = `${site.name}, ${site.role} — ${site.focus}. Currently at ${site.company.name}.`;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="author" content={site.name} />

	<link rel="canonical" href={site.url} />

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={site.name} />
	<meta property="og:url" content={site.url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content="{site.url}/og.png" />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={ogAlt} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content="{site.url}/og.png" />
	<meta name="twitter:image:alt" content={ogAlt} />
</svelte:head>

<a href="#top" class="skip">Skip to content</a>

<Loader />
<SiteHeader />

<main id="top">
	<Hero />
	<Systems />
	<Experience />
	<Projects />
	<Toolkit />
	<Recognition />
	<Trips />
	<Contact />
</main>

<SiteFooter />

<style>
	.skip {
		position: absolute;
		left: 8px;
		top: -100px;
		z-index: 60;
		padding: 8px 14px;
		background: var(--brand);
		color: var(--on-brand);
		border-radius: 4px;
		font-weight: 500;
		text-decoration: none;
	}
	.skip:focus {
		top: 8px;
	}
</style>
