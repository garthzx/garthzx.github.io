<script lang="ts">
	import './layout.css';
	import { onMount } from 'svelte';
	import { syncTheme } from '$lib/theme.svelte';

	let { children } = $props();

	onMount(syncTheme);
</script>

{@render children()}
