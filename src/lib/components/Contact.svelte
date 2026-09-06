<script lang="ts">
	import { site } from '$lib/data/site';
	import { reveal } from '$lib/actions/reveal';
	import Icon from './Icon.svelte';

	let copied = $state(false);
	let timer: ReturnType<typeof setTimeout>;

	async function copyEmail() {
		try {
			await navigator.clipboard.writeText(site.email);
			copied = true;
			clearTimeout(timer);
			timer = setTimeout(() => (copied = false), 1800);
		} catch {
			// Clipboard unavailable — the mailto link below still works.
		}
	}

	const links = [
		{ label: site.email, href: `mailto:${site.email}`, icon: 'mail' },
		{ label: 'LinkedIn', href: site.socials.linkedin, icon: 'linkedin' },
		{ label: 'GitHub', href: site.socials.github, icon: 'github' }
	] as const;
</script>

<section id="contact" class="scroll-mt-24 pt-16 pb-12 sm:pt-20">
	<div class="shell">
		<div
			class="contact-card relative overflow-hidden rounded-3xl px-6 py-14 text-center sm:px-12 sm:py-20"
			use:reveal
		>
			<p class="font-mono text-sm tracking-[0.2em] text-white/60 uppercase">Contact</p>
			<h2 class="mt-4 text-3xl font-bold text-white sm:text-5xl">Let&rsquo;s build something.</h2>
			<p class="mx-auto mt-4 max-w-xl leading-relaxed text-white/70">
				I&rsquo;m happily employed at {site.company.name}, but I always have time for a good
				conversation about backend architecture, automation, or an interesting problem.
			</p>

			<div class="mt-10 flex flex-wrap items-center justify-center gap-3">
				<a
					href="mailto:{site.email}"
					class="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5 hover:brightness-110"
				>
					<Icon name="mail" size={18} />
					Email me
				</a>
				<button
					type="button"
					onclick={copyEmail}
					class="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3.5 font-mono text-sm text-white/85 transition-colors hover:border-white/50 hover:bg-white/10"
				>
					{copied ? '✓ Copied' : site.email}
				</button>
			</div>

			<nav class="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
				{#each links as link (link.href)}
					<a
						href={link.href}
						target={link.href.startsWith('http') ? '_blank' : undefined}
						rel="noreferrer"
						class="inline-flex items-center gap-2 text-white/70 transition-colors hover:text-white"
					>
						<Icon name={link.icon} size={17} />
						<span class="text-[0.95rem]">{link.label}</span>
					</a>
				{/each}
			</nav>

			<p class="mt-10 font-mono text-sm text-white/45">
				{site.location} · {site.phone}
			</p>
		</div>
	</div>

	<footer
		class="shell mt-10 flex flex-col items-center gap-2 pb-10 text-sm text-ink-faint sm:flex-row sm:justify-between"
	>
		<p>&copy; {new Date().getFullYear()} Garth Ayang-ang. All rights reserved.</p>
		<p class="font-mono text-xs">Built with SvelteKit &amp; Tailwind CSS</p>
	</footer>
</section>

<style>
	.contact-card {
		background:
			radial-gradient(circle at 15% 0%, rgb(116 127 224 / 0.55), transparent 55%),
			radial-gradient(circle at 85% 100%, rgb(146 234 192 / 0.22), transparent 50%),
			linear-gradient(150deg, #3a2f66 0%, #2b2450 55%, #380428 100%);
	}
</style>
