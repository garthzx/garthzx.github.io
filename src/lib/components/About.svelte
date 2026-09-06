<script lang="ts">
	import Terminal from './Terminal.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { skillGroups, education, achievements } from '$lib/data/experience';
</script>

<section id="about" class="shell scroll-mt-24 py-20 sm:py-28">
	<div use:reveal>
		<h2 class="section-title">About me</h2>
	</div>

	<div class="mt-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
		<div class="space-y-6 text-lg leading-relaxed sm:text-xl sm:leading-[1.85]" use:reveal>
			<p>
				I&rsquo;m a full-stack engineer with
				<span class="font-semibold text-brand">3+ years</span> building production business systems, now
				working mostly at the back — architecture, third-party API integration, and business process automation
				for a multi-tenant SaaS platform.
			</p>
			<p>
				The work I like most is the unglamorous kind: taking a manual, staff-driven workflow and
				turning it into a durable automated pipeline. Self-service onboarding. Online payment
				collection. Booking-to-payment flows. Usually with TypeScript, Node, PostgreSQL,
				event-driven queues, and REST/webhook integrations across Stripe, telephony, and AWS.
			</p>
			<p>
				I tend to own a system end to end — find the operational bottleneck, choose the
				architecture, build and integrate it, automate it, document it, and then watch it in
				production.
			</p>
		</div>

		<div class="space-y-5" use:reveal={{ delay: 120 }}>
			<div class="rounded-xl border border-hairline bg-white/60 p-5">
				<p class="font-mono text-xs tracking-widest text-ink-faint uppercase">Education</p>
				<p class="mt-3 text-lg font-semibold">{education.degree}</p>
				<p class="mt-1 text-ink-soft">{education.school}</p>
				<div class="mt-3 flex flex-wrap items-center gap-2 text-sm text-ink-faint">
					<span class="rounded-full bg-brand-tint px-2.5 py-1 font-medium text-brand"
						>{education.honors}</span
					>
					<span>{education.period}</span>
				</div>
				<p class="mt-4 border-t border-hairline pt-4 text-sm leading-relaxed text-ink-soft">
					<span class="font-medium text-ink">Thesis —</span>
					{education.thesis}
				</p>
			</div>

			<div class="rounded-xl border border-hairline bg-white/60 p-5">
				<p class="font-mono text-xs tracking-widest text-ink-faint uppercase">Achievements</p>
				<ul class="mt-3 space-y-4">
					{#each achievements as a (a.title)}
						<li>
							<p class="leading-snug font-medium">{a.title}</p>
							<p class="mt-1 text-sm leading-relaxed text-ink-soft">{a.detail}</p>
							<p class="mt-1 font-mono text-xs text-ink-faint">{a.date}</p>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>

	<div class="mt-14" use:reveal>
		<Terminal />
	</div>

	<!-- Skills -->
	<div class="mt-16" use:reveal>
		<h3 class="font-mono text-xs tracking-[0.2em] text-ink-faint uppercase">What I build with</h3>
		<dl class="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
			{#each skillGroups as group (group.label)}
				<div class="border-t border-hairline pt-4">
					<dt class="text-sm font-semibold text-ink">{group.label}</dt>
					<dd class="mt-2.5 flex flex-wrap gap-1.5">
						{#each group.items as item (item)}
							<span
								class="rounded-md border border-mint/70 bg-white/70 px-2 py-1 text-[0.8rem] text-ink-soft"
								>{item}</span
							>
						{/each}
					</dd>
				</div>
			{/each}
		</dl>
	</div>
</section>
