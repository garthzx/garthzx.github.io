<script lang="ts">
	import { onMount } from 'svelte';

	let bar: HTMLDivElement;

	onMount(() => {
		let frame = 0;
		const update = () => {
			frame = 0;
			const max = document.documentElement.scrollHeight - innerHeight;
			bar.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
		};
		const onScroll = () => {
			frame ||= requestAnimationFrame(update);
		};
		update();
		addEventListener('scroll', onScroll, { passive: true });
		addEventListener('resize', onScroll);
		return () => {
			removeEventListener('scroll', onScroll);
			removeEventListener('resize', onScroll);
			cancelAnimationFrame(frame);
		};
	});
</script>

<div aria-hidden="true" class="progress" bind:this={bar}></div>

<style>
	.progress {
		position: absolute;
		left: 0;
		bottom: -1px;
		z-index: 1;
		width: 100%;
		height: 2px;
		background: var(--brand);
		transform: scaleX(0);
		transform-origin: left center;
	}
</style>
