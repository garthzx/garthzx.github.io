<script lang="ts">
	import Icon from './Icon.svelte';
	import SectionRule from './SectionRule.svelte';
	import { site } from '$lib/data/site';
	import { inview } from '$lib/motion.svelte';

	let copied = $state(false);
	let timer: ReturnType<typeof setTimeout>;

	async function copyEmail() {
		try {
			await navigator.clipboard.writeText(site.email);
		} catch {
			// No clipboard access; the address is still selectable and the link still works.
			return;
		}
		copied = true;
		clearTimeout(timer);
		timer = setTimeout(() => (copied = false), 1800);
	}
</script>

<section id="contact" data-theme="dark" aria-labelledby="contact-title" class="band">
	<div class="shell inner">
		<div class="rule-wrap"><SectionRule num="07" meta="Contact" /></div>
		<div class="cols">
			<div class="pitch">
				<h2 id="contact-title" data-reveal use:inview>Open to a good conversation.</h2>
				<p data-reveal data-delay="1" use:inview>
					I’m currently at {site.company.name}. If you’d like to talk about backend systems,
					integrations or automation, email is the best way to reach me.
				</p>
				<div class="email-row" data-reveal data-delay="2" use:inview>
					<a href="mailto:{site.email}" class="email">{site.email}</a>
					<button type="button" class="copy mono-label" onclick={copyEmail}>
						<Icon name="copy" size={14} /><span aria-live="polite"
							>{copied ? 'Copied' : 'Copy'}</span
						>
					</button>
				</div>
			</div>

			<dl data-reveal data-delay="3" use:inview>
				<div>
					<dt class="mono-label">LinkedIn</dt>
					<dd><a href={site.socials.linkedin}>{site.socials.linkedinHandle}</a></dd>
				</div>
				<div>
					<dt class="mono-label">GitHub</dt>
					<dd><a href={site.socials.github}>{site.socials.githubHandle}</a></dd>
				</div>
				<div>
					<dt class="mono-label">Résumé</dt>
					<dd><a href={site.resume.href} download>{site.resume.label}</a></dd>
				</div>
				<div>
					<dt class="mono-label">Based in</dt>
					<dd class="plain">{site.city}, {site.country}</dd>
				</div>
			</dl>
		</div>
	</div>
</section>

<style>
	.band {
		scroll-margin-top: 80px;
		background: var(--paper);
		color: var(--ink);
		border-top: 1px solid var(--hair);
	}
	.inner {
		padding-block: clamp(64px, 9vw, 128px);
	}
	.rule-wrap {
		margin-bottom: 32px;
	}
	.cols {
		display: flex;
		flex-wrap: wrap;
		gap: 48px clamp(32px, 6vw, 96px);
	}
	.pitch {
		flex: 1.3 1 440px;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 24px;
	}
	h2 {
		margin: 0;
		font-family: var(--font-serif);
		font-weight: 400;
		font-size: clamp(38px, 5vw, 61px);
		line-height: 1.05;
		letter-spacing: -0.02em;
		color: var(--deep);
		font-variation-settings: 'opsz' 60;
		text-wrap: balance;
	}
	.pitch p {
		max-width: 46ch;
		margin: 0;
		font-size: 18px;
		line-height: 1.55;
		color: var(--muted);
		text-wrap: pretty;
	}
	.email-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px;
	}
	.email {
		font-family: var(--font-serif);
		font-size: clamp(22px, 2.6vw, 31px);
		line-height: 1.2;
		overflow-wrap: anywhere;
	}
	.copy {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		min-height: 40px;
		padding: 0 12px;
		background: none;
		border: 1px solid var(--hair);
		border-radius: 4px;
		color: var(--ink);
		cursor: pointer;
		font-size: 11.5px;
		letter-spacing: 0.1em;
	}
	.copy:hover {
		border-color: var(--brand);
		color: var(--brand);
	}

	dl {
		flex: 1 1 320px;
		align-self: flex-end;
		display: flex;
		flex-direction: column;
		margin: 0;
	}
	dl > div {
		display: flex;
		justify-content: space-between;
		gap: 16px;
		padding: 14px 0;
		border-top: 1px solid var(--hair);
	}
	dl > div:last-child {
		border-bottom: 1px solid var(--hair);
	}
	dt {
		font-size: 11.5px;
		line-height: 1.9;
		color: var(--muted);
	}
	dd {
		margin: 0;
		text-align: right;
	}
	dd.plain {
		color: var(--ink);
	}
</style>
