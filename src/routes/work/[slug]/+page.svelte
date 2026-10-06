<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from '$lib/components/Icon.svelte';
	import ScrollProgress from '$lib/components/ScrollProgress.svelte';
	import SystemDiagram from '$lib/components/SystemDiagram.svelte';
	import DiagramLegend from '$lib/components/DiagramLegend.svelte';
	import SiteFooter from '$lib/components/SiteFooter.svelte';
	import { site, nav } from '$lib/data/site';
	import { caseHref } from '$lib/data/cases';
	import { inview } from '$lib/motion.svelte';
	import { theme, toggleTheme } from '$lib/theme.svelte';

	let { data } = $props();
	const c = $derived(data.study);
	const next = $derived(data.next);

	const SECTIONS = [
		['context', 'Context'],
		['problem', 'Problem'],
		['architecture', 'Architecture'],
		['built', 'What I built'],
		['outcome', 'Outcome']
	] as const;

	let active = $state<string>('context');
	const themeLabel = $derived(
		theme.value === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
	);

	// Highlight the section nearest the top of the viewport in the on-page nav.
	onMount(() => {
		const io = new IntersectionObserver(
			(entries) => {
				const top = entries
					.filter((e) => e.isIntersecting)
					.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
				if (top) active = top.target.id;
			},
			{ rootMargin: '-140px 0px -55% 0px' }
		);
		for (const [id] of SECTIONS) {
			const el = document.getElementById(id);
			if (el) io.observe(el);
		}
		return () => io.disconnect();
	});

	const pad2 = (n: number) => String(n).padStart(2, '0');
</script>

<svelte:head>
	<title>{c.title} — Case study — {site.name}</title>
	<meta name="description" content={c.summary} />
	<link rel="canonical" href="{site.url}{caseHref(c.slug)}" />
	<meta property="og:type" content="article" />
	<meta property="og:title" content="{c.title} — {site.name}" />
	<meta property="og:description" content={c.summary} />
	<meta property="og:url" content="{site.url}{caseHref(c.slug)}" />
	<meta property="og:image" content="{site.url}/og.png" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<header class="cs-header">
	<ScrollProgress />
	<div class="bar-row">
		<div class="shell bar">
			<a href="/" class="wordmark">{site.name}</a>
			<nav aria-label="Primary" class="primary">
				<a href="/#systems" aria-current="page" class="current">Work</a>
				<div class="more">
					{#each nav.slice(1) as item (item.id)}
						<a href="/#{item.id}">{item.label}</a>
					{/each}
				</div>
				<button type="button" class="icon-btn theme" onclick={toggleTheme} aria-label={themeLabel}>
					<Icon name="theme" size={18} />
				</button>
			</nav>
		</div>
	</div>
	<div class="toc-row">
		<nav aria-label="On this page" class="shell toc">
			{#each SECTIONS as [id, label], i (id)}
				<a
					href="#{id}"
					class="mono-label"
					class:on={active === id}
					aria-current={active === id ? 'location' : undefined}
					><span class="brass">{pad2(i + 1)}</span>{label}</a
				>
			{/each}
		</nav>
	</div>
</header>

<main>
	<section aria-labelledby="cs-title" class="shell intro">
		<a href="/#systems" class="back mono-label"
			><Icon name="arrow-left" size={14} />Selected systems</a
		>
		<div class="intro-copy" data-reveal use:inview>
			<span class="mono-label brass">Case study · System {c.num}</span>
			<h1 id="cs-title">{c.title}</h1>
			<p>{c.summary}</p>
		</div>
		<dl data-reveal data-delay="2" use:inview>
			<div>
				<dt class="mono-label">Company</dt>
				<dd>{site.company.name}</dd>
			</div>
			<div>
				<dt class="mono-label">Role</dt>
				<dd>{site.role}, owner</dd>
			</div>
			<div>
				<dt class="mono-label">Period</dt>
				<dd>Aug 2025 – present</dd>
			</div>
			<div>
				<dt class="mono-label">Stack</dt>
				<dd class="stack">
					{#each c.stack as t (t)}<span class="tag">{t}</span>{/each}
				</dd>
			</div>
		</dl>
	</section>

	<section id="context" aria-labelledby="h-context" class="shell part">
		<div class="row" data-reveal use:inview>
			<div class="label">
				<span class="n">01</span>
				<h2 id="h-context">Context</h2>
			</div>
			<p class="body-copy">{c.context}</p>
		</div>
	</section>

	<section id="problem" aria-labelledby="h-problem" class="shell part">
		<div class="row ruled" data-reveal use:inview>
			<div class="label">
				<span class="n">02</span>
				<h2 id="h-problem">Problem</h2>
			</div>
			<ul class="problems body-copy">
				{#each c.problem as p (p)}
					<li><span aria-hidden="true" class="dash"></span><span>{p}</span></li>
				{/each}
			</ul>
		</div>
	</section>

	<section id="architecture" aria-labelledby="h-arch" class="shell part">
		<div class="arch ruled">
			<div class="row end">
				<div class="label">
					<span class="n">03</span>
					<h2 id="h-arch">Architecture</h2>
				</div>
				<p class="note body-copy">{c.archNote}</p>
			</div>
			<figure data-reveal data-delay="1" use:inview>
				<div class="frame">
					{#key c.slug}<SystemDiagram kind={c.slug} minWidth={760} />{/key}
				</div>
				<figcaption class="fig-foot">
					<span class="mono-label fig-label">Fig. {c.num} — {c.fig}</span>
					<DiagramLegend />
				</figcaption>
			</figure>
		</div>
	</section>

	<section id="built" aria-labelledby="h-built" class="shell part">
		<div class="row ruled" data-reveal use:inview>
			<div class="label">
				<span class="n">04</span>
				<h2 id="h-built">What I built</h2>
			</div>
			<ol class="built">
				{#each c.built as b, i (b.h)}
					<li data-reveal use:inview>
						<span class="b-n">{pad2(i + 1)}</span>
						<h3>{b.h}</h3>
						<p>{b.p}</p>
					</li>
				{/each}
			</ol>
		</div>
	</section>

	<section id="outcome" aria-labelledby="h-outcome" class="shell part last">
		<div class="row ruled" data-reveal use:inview>
			<div class="label">
				<span class="n">05</span>
				<h2 id="h-outcome">Outcome</h2>
			</div>
			<ul class="outcomes">
				{#each c.outcome as o (o)}
					<li>
						<svg width="12" height="12" aria-hidden="true"
							><rect x="1" y="1" width="10" height="10" /></svg
						><span>{o}</span>
					</li>
				{/each}
			</ul>
		</div>
	</section>

	<nav aria-label="Next case study" class="next-wrap">
		<a href={caseHref(next.slug)} class="shell next">
			<span class="next-copy">
				<span class="mono-label next-label">Next · System {next.num}</span>
				<span class="next-title">{next.title}</span>
			</span>
			<Icon name="arrow-right" size={32} />
		</a>
	</nav>
</main>

<SiteFooter home={false} />

<style>
	.brass {
		color: var(--brass-text);
	}

	/* Header */
	.cs-header {
		position: sticky;
		top: 0;
		z-index: 20;
		background: var(--paper);
	}
	.bar-row,
	.toc-row {
		border-bottom: 1px solid var(--hair);
		background: var(--paper);
	}
	.bar {
		height: 68px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
	}
	.wordmark {
		font-family: var(--font-serif);
		font-size: 21px;
		font-weight: 500;
		letter-spacing: -0.01em;
		color: var(--deep);
		text-decoration: none;
	}
	.wordmark:hover {
		color: var(--deep);
	}
	.primary {
		display: flex;
		align-items: center;
		gap: 20px;
		font-size: 15px;
	}
	.primary a {
		padding: 6px 0;
		border-bottom: 1px solid transparent;
		color: var(--ink);
		text-decoration: none;
	}
	.primary a:hover,
	.primary a.current {
		color: var(--brand);
		border-bottom-color: var(--brand);
	}
	.more {
		display: none;
		gap: 20px;
	}
	.theme {
		width: 40px;
		height: 40px;
	}
	@media (min-width: 760px) {
		.more {
			display: flex;
		}
	}
	.toc {
		display: flex;
		gap: 4px 28px;
		overflow-x: auto;
	}
	.toc a {
		flex: none;
		display: flex;
		align-items: center;
		gap: 8px;
		min-height: 44px;
		font-size: 11.5px;
		text-decoration: none;
		color: var(--muted);
		border-bottom: 2px solid transparent;
	}
	.toc a:hover {
		color: var(--brand);
	}
	.toc a.on {
		color: var(--deep);
		border-bottom-color: var(--brand);
	}

	/* Intro */
	.intro {
		display: flex;
		flex-direction: column;
		gap: 28px;
		padding-top: clamp(40px, 6vw, 80px);
		padding-bottom: clamp(32px, 4vw, 56px);
	}
	.back {
		align-self: flex-start;
		display: inline-flex;
		align-items: center;
		gap: 8px;
		min-height: 44px;
		text-decoration: none;
	}
	.intro-copy {
		display: flex;
		flex-direction: column;
		gap: 18px;
		max-width: 880px;
	}
	h1 {
		margin: 0;
		font-family: var(--font-serif);
		font-weight: 400;
		font-size: clamp(40px, 5.6vw, 68px);
		line-height: 1.04;
		letter-spacing: -0.02em;
		color: var(--deep);
		font-variation-settings: 'opsz' 72;
		text-wrap: balance;
	}
	.intro-copy p {
		max-width: 56ch;
		margin: 0;
		font-size: clamp(18px, 1.7vw, 21px);
		line-height: 1.55;
		text-wrap: pretty;
	}
	dl {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		margin: 16px 0 0;
		border-top: 1px solid var(--ink);
	}
	dl > div {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 14px 24px 14px 0;
		border-bottom: 1px solid var(--hair);
	}
	dt {
		font-size: 11px;
		color: var(--muted);
	}
	dd {
		margin: 0;
		font-size: 15px;
	}
	dd.stack {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-top: 2px;
	}

	/* Parts */
	.part {
		scroll-margin-top: 130px;
		padding-block: clamp(32px, 4vw, 56px);
	}
	.part.last {
		padding-bottom: clamp(64px, 8vw, 112px);
	}
	.row {
		display: flex;
		flex-wrap: wrap;
		gap: 12px clamp(32px, 6vw, 96px);
	}
	.row.end {
		align-items: flex-end;
	}
	.ruled {
		padding-top: 32px;
		border-top: 1px solid var(--hair);
	}
	.label {
		flex: 0 1 240px;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.n {
		font-family: var(--font-mono);
		font-size: 12px;
		letter-spacing: 0.12em;
		color: var(--brass-text);
	}
	h2 {
		margin: 0;
		font-family: var(--font-serif);
		font-weight: 400;
		font-size: 31px;
		line-height: 1.15;
		color: var(--deep);
	}
	.body-copy {
		flex: 1 1 480px;
		max-width: 66ch;
		margin: 0;
		font-size: 17px;
		line-height: 1.7;
		text-wrap: pretty;
	}
	.note {
		font-size: 16px;
		line-height: 1.65;
		color: var(--muted);
	}
	.problems {
		display: flex;
		flex-direction: column;
		gap: 14px;
		padding: 0;
		list-style: none;
	}
	.problems li {
		display: flex;
		gap: 14px;
		line-height: 1.65;
	}
	.dash {
		flex: none;
		width: 12px;
		height: 1px;
		margin-top: 14px;
		background: var(--brass);
	}

	.arch {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}
	figure {
		display: flex;
		flex-direction: column;
		gap: 14px;
		margin: 0;
	}
	.frame {
		overflow: hidden;
		padding: clamp(4px, 2vw, 24px);
		background: var(--surface);
		border: 1px solid var(--hair);
		border-radius: 4px;
	}
	.fig-foot {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 12px 32px;
	}
	.fig-label {
		font-size: 11px;
		letter-spacing: 0.1em;
		color: var(--muted);
	}

	.built {
		flex: 1 1 480px;
		max-width: 720px;
		display: flex;
		flex-direction: column;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.built li {
		display: grid;
		grid-template-columns: 48px minmax(0, 1fr);
		gap: 4px 16px;
		padding: 20px 0;
		border-bottom: 1px solid var(--hair);
	}
	.b-n {
		grid-row: span 2;
		padding-top: 5px;
		font-family: var(--font-mono);
		font-size: 12px;
		letter-spacing: 0.06em;
		color: var(--brand);
	}
	.built h3 {
		margin: 0;
		font-family: var(--font-serif);
		font-weight: 500;
		font-size: 22px;
		line-height: 1.3;
		color: var(--deep);
	}
	.built p {
		margin: 0;
		line-height: 1.65;
		text-wrap: pretty;
	}

	.outcomes {
		flex: 1 1 480px;
		max-width: 720px;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
		gap: 16px;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.outcomes li {
		display: flex;
		gap: 12px;
		padding: 16px 18px;
		background: var(--surface);
		border: 1px solid var(--hair);
		border-radius: 4px;
		line-height: 1.55;
	}
	.outcomes svg {
		flex: none;
		margin-top: 6px;
	}
	.outcomes rect {
		fill: var(--brand);
	}

	.next-wrap {
		border-top: 1px solid var(--hair);
	}
	.next {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		justify-content: space-between;
		gap: 16px 48px;
		padding-block: clamp(40px, 6vw, 72px);
		color: var(--deep);
		text-decoration: none;
	}
	.next:hover {
		color: var(--brand);
	}
	.next-copy {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.next-label {
		color: var(--muted);
	}
	.next-title {
		font-family: var(--font-serif);
		font-size: clamp(28px, 3.4vw, 44px);
		line-height: 1.1;
		letter-spacing: -0.01em;
	}
</style>
