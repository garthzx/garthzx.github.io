export type Theme = 'light' | 'dark';

const PAPER: Record<Theme, string> = { light: '#f6f4ec', dark: '#1a1d14' };

/** Mirrors html[data-theme], which app.html sets before first paint. */
export const theme = $state<{ value: Theme }>({ value: 'light' });

export function syncTheme(): void {
	theme.value = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

export function toggleTheme(): void {
	theme.value = theme.value === 'dark' ? 'light' : 'dark';
	document.documentElement.dataset.theme = theme.value;
	document.querySelector('meta[name="theme-color"]')?.setAttribute('content', PAPER[theme.value]);
	try {
		localStorage.setItem('gda-theme', theme.value);
	} catch {
		// Storage can be unavailable (private mode); the toggle still works for this page.
	}
}
