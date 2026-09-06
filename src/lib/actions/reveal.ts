import type { Action } from 'svelte/action';

type Options = {
	/** Stagger, in milliseconds, before the element animates in. */
	delay?: number;
	/** How much of the element must be on screen before it reveals. */
	threshold?: number;
	/** Re-hide the element when it scrolls back out of view. */
	repeat?: boolean;
};

/**
 * Reveals an element the first time it scrolls into view. Replaces the AOS
 * dependency the previous portfolio used.
 */
export const reveal: Action<HTMLElement, Options | undefined> = (node, options) => {
	const apply = (opts: Options | undefined) => {
		node.dataset.reveal = '';
		node.style.setProperty('--reveal-delay', `${opts?.delay ?? 0}ms`);
	};

	apply(options);

	if (typeof IntersectionObserver === 'undefined') {
		node.classList.add('is-visible');
		return {};
	}

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					node.classList.add('is-visible');
					if (!options?.repeat) observer.unobserve(node);
				} else if (options?.repeat) {
					node.classList.remove('is-visible');
				}
			}
		},
		{ threshold: options?.threshold ?? 0.12, rootMargin: '0px 0px -40px 0px' }
	);

	observer.observe(node);

	return {
		update: apply,
		destroy: () => observer.disconnect()
	};
};
