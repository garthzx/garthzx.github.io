<script lang="ts">
	import Icon from './Icon.svelte';
	import ScrollProgress from './ScrollProgress.svelte';
	import { site, nav } from '$lib/data/site';
	import { theme, toggleTheme } from '$lib/theme.svelte';

	let menuOpen = $state(false);
	const themeLabel = $derived(
		theme.value === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
	);
</script>

<header class="site-header">
	<ScrollProgress />
	<div class="shell bar">
		<a href="#top" class="wordmark">{site.name}</a>

		<nav aria-label="Primary" class="wide">
			<div class="links">
				{#each nav as item (item.id)}
					<a href="#{item.id}">{item.label}</a>
				{/each}
			</div>
			<span aria-hidden="true" class="divider"></span>
			<div class="actions">
				<a href={site.socials.github} aria-label="GitHub" class="icon-btn"
					><Icon name="github" size={18} /></a
				>
				<a href={site.socials.linkedin} aria-label="LinkedIn" class="icon-btn"
					><Icon name="linkedin" size={17} /></a
				>
				<button type="button" class="icon-btn" onclick={toggleTheme} aria-label={themeLabel}>
					<Icon name="theme" size={18} />
				</button>
				<a href={site.resume.href} download class="resume"><Icon name="download" />Résumé</a>
			</div>
		</nav>

		<div class="narrow">
			<button type="button" class="icon-btn touch" onclick={toggleTheme} aria-label={themeLabel}>
				<Icon name="theme" size={18} />
			</button>
			<button
				type="button"
				class="menu-btn mono-label"
				onclick={() => (menuOpen = !menuOpen)}
				aria-expanded={menuOpen}
				aria-controls="mobile-menu">{menuOpen ? 'Close' : 'Menu'}</button
			>
		</div>
	</div>

	{#if menuOpen}
		<nav id="mobile-menu" aria-label="Primary" class="menu">
			{#each nav as item (item.id)}
				<a href="#{item.id}" onclick={() => (menuOpen = false)}>
					{item.label}<span class="menu-num">{item.num}</span>
				</a>
			{/each}
			<div class="menu-actions">
				<a href={site.resume.href} download class="menu-resume">Download résumé</a>
				<a href={site.socials.github} class="menu-link">GitHub</a>
				<a href={site.socials.linkedin} class="menu-link">LinkedIn</a>
			</div>
		</nav>
	{/if}
</header>

<style>
	.site-header {
		position: sticky;
		top: 0;
		z-index: 20;
		background: var(--paper);
		border-bottom: 1px solid var(--hair);
	}
	.bar {
		height: 68px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
	}
	.wordmark {
		font-family: var(--font-serif);
		/* Full size from ~390px up; scales down just enough on narrower phones
		   to stay on one line beside the menu controls. */
		font-size: clamp(17px, calc((100vw - 184px) / 10), 21px);
		font-weight: 500;
		letter-spacing: -0.01em;
		font-variation-settings: 'opsz' 24;
		color: var(--deep);
		text-decoration: none;
	}
	.wordmark:hover {
		color: var(--deep);
	}

	.wide {
		display: none;
		align-items: center;
		gap: 28px;
	}
	.links {
		display: flex;
		gap: 24px;
		font-size: 15px;
	}
	.links a {
		padding: 6px 0;
		border-bottom: 1px solid transparent;
		color: var(--ink);
		text-decoration: none;
	}
	.links a:hover {
		color: var(--brand);
		border-bottom-color: var(--brand);
	}
	.divider {
		width: 1px;
		height: 20px;
		background: var(--hair);
	}
	.actions {
		display: flex;
		align-items: center;
		gap: 6px;
	}
	.resume {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-left: 8px;
		padding: 8px 14px;
		border: 1px solid var(--ink);
		border-radius: 4px;
		color: var(--ink);
		font-size: 14px;
		font-weight: 500;
		text-decoration: none;
	}
	.resume:hover {
		background: var(--tint);
		color: var(--ink);
	}
	.resume:active {
		transform: translateY(1px);
	}

	.narrow {
		display: flex;
		align-items: center;
		gap: 4px;
	}
	.touch {
		width: 44px;
		height: 44px;
	}
	/* Fixed width, so swapping "Menu" for "Close" doesn't shift the header. */
	.menu-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 72px;
		height: 44px;
		padding: 0 12px;
		background: none;
		border: 1px solid var(--hair);
		border-radius: 4px;
		color: var(--ink);
		cursor: pointer;
	}

	.menu {
		padding: 8px var(--gutter) 24px;
		border-top: 1px solid var(--hair);
		background: var(--paper);
	}
	.menu > a {
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 52px;
		border-bottom: 1px solid var(--hair);
		color: var(--deep);
		text-decoration: none;
		font-family: var(--font-serif);
		font-size: 25px;
	}
	.menu-num {
		font-family: var(--font-mono);
		font-size: 12px;
		letter-spacing: 0.12em;
		color: var(--muted);
	}
	.menu-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-top: 20px;
	}
	.menu-resume {
		display: flex;
		align-items: center;
		min-height: 44px;
		padding: 0 16px;
		border: 1px solid var(--ink);
		border-radius: 4px;
		color: var(--ink);
		text-decoration: none;
		font-size: 15px;
		font-weight: 500;
	}
	.menu-link {
		display: flex;
		align-items: center;
		min-height: 44px;
		padding: 0 12px;
		font-size: 15px;
	}

	@media (min-width: 880px) {
		.bar {
			gap: 24px;
		}
		.wide {
			display: flex;
		}
		.narrow,
		.menu {
			display: none;
		}
	}
</style>
