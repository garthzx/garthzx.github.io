import type { Action } from 'svelte/action';

const hasDocument = typeof document !== 'undefined';

/** True when app.html switched animations on (no reduced-motion preference, no ?motion=off). */
export function motionOn(): boolean {
	return hasDocument && document.documentElement.dataset.motion === 'on';
}

/**
 * Whether the intro curtain has finished. Reveals, the toolkit cycle and the
 * trips slideshow all wait for it, so nothing animates unseen behind it.
 */
export const intro = $state({
	done: !hasDocument || document.documentElement.dataset.intro !== 'run'
});

let observer: IntersectionObserver | undefined;
// Plain bookkeeping for elements queued behind the intro; nothing renders from it.
// eslint-disable-next-line svelte/prefer-svelte-reactivity
const waiting = new Set<Element>();

function getObserver(): IntersectionObserver {
	observer ??= new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				entry.target.setAttribute('data-in', '');
				observer?.unobserve(entry.target);
			}
		},
		{ rootMargin: '0px 0px -6% 0px', threshold: 0.06 }
	);
	return observer;
}

/** Called by the loader as its curtain lifts. */
export function finishIntro(): void {
	intro.done = true;
	delete document.documentElement.dataset.intro;
	for (const el of waiting) getObserver().observe(el);
	waiting.clear();
}

/**
 * Marks an element as revealed ([data-in]) once it scrolls into view. Pair it
 * with data-reveal, data-rule or data-line in the markup; the CSS in
 * layout.css does the animating.
 */
export const inview: Action<Element> = (node) => {
	if (!motionOn() || typeof IntersectionObserver === 'undefined') return;
	if (intro.done) getObserver().observe(node);
	else waiting.add(node);
	return {
		destroy() {
			waiting.delete(node);
			observer?.unobserve(node);
		}
	};
};
