import type { Action } from 'svelte/action';

/** Calls `step(1)` on a left swipe and `step(-1)` on a right swipe of more than 40px. */
export const swipe: Action<HTMLElement, (direction: 1 | -1) => void> = (node, step) => {
	let onStep = step;
	let x0: number | null = null;

	const down = (e: PointerEvent) => {
		x0 = e.clientX;
	};
	const up = (e: PointerEvent) => {
		if (x0 === null) return;
		const dx = e.clientX - x0;
		x0 = null;
		if (Math.abs(dx) > 40) onStep(dx < 0 ? 1 : -1);
	};

	node.addEventListener('pointerdown', down);
	node.addEventListener('pointerup', up);
	return {
		update(next) {
			onStep = next;
		},
		destroy() {
			node.removeEventListener('pointerdown', down);
			node.removeEventListener('pointerup', up);
		}
	};
};
