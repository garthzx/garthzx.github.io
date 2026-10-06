import { error } from '@sveltejs/kit';
import { cases } from '$lib/data/cases';
import type { EntryGenerator, PageLoad } from './$types';

/** Prerender one page per case study. */
export const entries: EntryGenerator = () => cases.map((c) => ({ slug: c.slug }));

export const load: PageLoad = ({ params }) => {
	const i = cases.findIndex((c) => c.slug === params.slug);
	if (i === -1) error(404, 'No such case study');
	return { study: cases[i], next: cases[(i + 1) % cases.length] };
};
