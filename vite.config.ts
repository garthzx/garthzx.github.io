import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// Fully static build for GitHub Pages (garthzx.github.io — a user
			// site, so there is no base path to configure). The 404 fallback
			// replaces GitHub's default not-found page.
			adapter: adapter({ fallback: '404.html' })
		})
	]
});
