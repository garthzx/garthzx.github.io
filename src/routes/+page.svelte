<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import About from '$lib/components/About.svelte';
	import Work from '$lib/components/Work.svelte';
	import Projects from '$lib/components/Projects.svelte';
	import AwayFromKeyboard from '$lib/components/AwayFromKeyboard.svelte';
	import Contact from '$lib/components/Contact.svelte';
	import { site } from '$lib/data/site';

	const description = `${site.fullName} — ${site.role} focused on backend architecture, third-party API integration, and business process automation. Currently at ${site.company.name}.`;

	const ogAlt = `${site.fullName}, ${site.role} — ${site.focus}. Currently at ${site.company.name}.`;
</script>

<svelte:head>
	<title>{site.name} — {site.role}</title>
	<meta name="description" content={description} />
	<meta name="author" content={site.fullName} />

	<link rel="canonical" href={site.url} />

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={site.fullName} />
	<meta property="og:url" content={site.url} />
	<meta property="og:title" content="{site.name} — {site.role}" />
	<meta property="og:description" content={description} />
	<meta property="og:image" content="{site.url}/og.png" />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={ogAlt} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="{site.name} — {site.role}" />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content="{site.url}/og.png" />
	<meta name="twitter:image:alt" content={ogAlt} />
</svelte:head>

<a
	href="#main"
	class="sr-only rounded-br-lg bg-brand px-4 py-2 font-medium text-white focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-[60]"
>
	Skip to content
</a>

<div id="top"></div>

<Header />

<main id="main">
	<Work />
	<Projects />
	<About />
	<AwayFromKeyboard />
	<Contact />
</main>
