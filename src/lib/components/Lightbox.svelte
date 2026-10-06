<script lang="ts">
	import { onMount, tick } from 'svelte';
	import Icon from './Icon.svelte';
	import { photos, stops, plateOf } from '$lib/data/trips';
	import { swipe } from '$lib/swipe';

	let { index = $bindable(), onclose }: { index: number; onclose: () => void } = $props();

	const pad2 = (n: number) => String(n).padStart(2, '0');
	const step = (d: number) => (index = (index + d + photos.length) % photos.length);

	let dialog: HTMLDivElement;
	let closeBtn: HTMLButtonElement;

	onMount(() => {
		const returnTo = document.activeElement as HTMLElement | null;
		const overflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		tick().then(() => closeBtn.focus());

		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onclose();
			else if (e.key === 'ArrowRight') step(1);
			else if (e.key === 'ArrowLeft') step(-1);
			else if (e.key === 'Tab') {
				const focusable = [...dialog.querySelectorAll<HTMLButtonElement>('button')];
				const i = focusable.indexOf(document.activeElement as HTMLButtonElement);
				if (e.shiftKey && i <= 0) {
					e.preventDefault();
					focusable.at(-1)?.focus();
				} else if (!e.shiftKey && i === focusable.length - 1) {
					e.preventDefault();
					focusable[0].focus();
				}
			}
		};
		addEventListener('keydown', onKey);

		return () => {
			removeEventListener('keydown', onKey);
			document.body.style.overflow = overflow;
			returnTo?.focus?.();
		};
	});

	// Clicks on the backdrop (but not on the photo or controls) close the lightbox.
	function onBackdrop(e: MouseEvent) {
		if ((e.target as HTMLElement).hasAttribute('data-backdrop')) onclose();
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	bind:this={dialog}
	class="lb"
	data-theme="dark"
	data-backdrop
	role="dialog"
	aria-modal="true"
	aria-label="Photographs, away from the keyboard"
	tabindex="-1"
	onclick={onBackdrop}
>
	<div class="lb-top">
		<span class="lb-counter mono-label" aria-live="polite"
			><span class="brass">{stops[photos[index].stop].place}</span> · {pad2(index + 1)} / {pad2(
				photos.length
			)}</span
		>
		<button type="button" class="lb-close mono-label" bind:this={closeBtn} onclick={onclose}
			>Close<span class="muted">Esc</span></button
		>
	</div>

	<div class="lb-stage" data-backdrop>
		<button type="button" class="lb-arrow" onclick={() => step(-1)} aria-label="Previous photo"
			><Icon name="arrow-left" /></button
		>
		<div class="lb-photos" data-backdrop use:swipe={step}>
			{#each photos as p, i (p.src)}
				<img
					src={p.src}
					alt={p.alt}
					loading="lazy"
					draggable="false"
					class:on={i === index}
					aria-hidden={i === index ? undefined : 'true'}
				/>
			{/each}
		</div>
		<button type="button" class="lb-arrow" onclick={() => step(1)} aria-label="Next photo"
			><Icon name="arrow-right" /></button
		>
	</div>

	<div class="lb-foot">
		<p class="lb-caption"><span class="lb-plate">{plateOf(index)}</span>{photos[index].caption}</p>
		<div class="lb-thumbs">
			{#each photos as p, i (p.src)}
				<button
					type="button"
					onclick={() => (index = i)}
					aria-label="Show photo {i + 1}: {p.caption}"
					aria-current={i === index ? 'true' : undefined}
					class:on={i === index}
				>
					<img src={p.src} alt="" loading="lazy" style:object-position={p.pos} />
				</button>
			{/each}
		</div>
	</div>
</div>

<style>
	.lb {
		position: fixed;
		inset: 0;
		z-index: 100;
		display: grid;
		grid-template-rows: auto minmax(0, 1fr) auto;
		background: rgba(18, 20, 13, 0.97);
		color: var(--ink);
		animation: lb-in 260ms var(--ez);
	}
	.lb:focus {
		outline: none;
	}
	.brass {
		color: var(--brass-text);
	}
	.muted {
		color: var(--muted);
	}
	.lb-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 16px clamp(16px, 3vw, 32px);
	}
	.lb-counter {
		color: var(--muted);
	}
	.lb-close {
		display: flex;
		align-items: center;
		gap: 10px;
		min-height: 44px;
		padding: 0 14px;
		background: none;
		border: 1px solid var(--hair);
		border-radius: 4px;
		color: var(--ink);
		cursor: pointer;
		font-size: 11.5px;
	}
	.lb-close:hover {
		border-color: var(--brand);
		color: var(--brand);
	}
	.lb-stage {
		position: relative;
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		align-items: center;
		gap: clamp(8px, 2vw, 24px);
		min-height: 0;
		padding: 0 clamp(8px, 2vw, 24px);
	}
	.lb-arrow {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		padding: 0;
		background: var(--surface);
		border: 1px solid var(--hair);
		border-radius: 4px;
		color: var(--ink);
		cursor: pointer;
	}
	.lb-arrow:hover {
		border-color: var(--brand);
		color: var(--brand);
	}
	.lb-photos {
		position: relative;
		height: 100%;
		min-height: 0;
		touch-action: pan-y;
	}
	.lb-photos img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: contain;
		opacity: 0;
		transform: scale(0.985);
		transition:
			opacity 420ms var(--ez),
			transform 700ms var(--ez);
		pointer-events: none;
		user-select: none;
	}
	.lb-photos img.on {
		opacity: 1;
		transform: none;
	}
	.lb-foot {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 16px 32px;
		padding: 16px clamp(16px, 3vw, 32px) 20px;
		animation: lb-up 420ms var(--ez);
	}
	.lb-caption {
		display: flex;
		gap: 12px;
		margin: 0;
		font-family: var(--font-serif);
		font-size: 21px;
		line-height: 1.3;
		color: var(--deep);
	}
	.lb-plate {
		padding-top: 5px;
		font-family: var(--font-mono);
		font-size: 12px;
		letter-spacing: 0.06em;
		color: var(--brass-text);
	}
	.lb-thumbs {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	.lb-thumbs button {
		display: block;
		width: 56px;
		height: 42px;
		padding: 0;
		border: 0;
		border-radius: 2px;
		overflow: hidden;
		cursor: pointer;
		opacity: 0.5;
		outline: 1.5px solid transparent;
		outline-offset: 2px;
		transition: opacity 200ms ease;
	}
	.lb-thumbs button:hover,
	.lb-thumbs button.on {
		opacity: 1;
	}
	.lb-thumbs button.on {
		outline-color: var(--brand);
	}
	.lb-thumbs img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	@keyframes lb-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	@keyframes lb-up {
		from {
			opacity: 0;
			transform: translateY(14px) scale(0.985);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
</style>
