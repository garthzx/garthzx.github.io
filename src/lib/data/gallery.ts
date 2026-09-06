import tableTennis from '$lib/assets/table-tennis.jpg';
import meCloseup from '$lib/assets/me-closeup.jpg';
import fam from '$lib/assets/fam.jpg';
import tagbilaran from '$lib/assets/tagbilaran.jpg';
import cebu from '$lib/assets/cebu1.jpg';

export type Photo = {
	id: string;
	src: string;
	alt: string;
	caption: string;
	/**
	 * Grid placement. Mobile is a 2-column grid; from `sm` up it becomes a
	 * 4-column mosaic with one featured tile.
	 */
	span: string;
	/** object-position, so faces don't get cropped out. */
	position?: string;
};

export const gallery: Photo[] = [
	{
		id: 'table-tennis',
		src: tableTennis,
		alt: 'Garth and teammates behind a table tennis table',
		caption: 'Table tennis with the crew',
		span: 'col-span-2 row-span-2 sm:col-span-2 sm:row-span-2',
		position: 'object-center'
	},
	{
		id: 'closeup',
		src: meCloseup,
		alt: 'Portrait of Garth',
		caption: 'Not every photo needs a caption',
		span: 'col-span-1 row-span-1 sm:col-span-2 sm:row-span-1',
		position: 'object-[50%_42%]'
	},
	{
		id: 'fam',
		src: fam,
		alt: 'Garth and family swimming in a cave pool',
		caption: 'Family, mid-adventure',
		span: 'col-span-1 row-span-1 sm:col-span-2 sm:row-span-1',
		position: 'object-[50%_62%]'
	},
	{
		id: 'tagbilaran',
		src: tagbilaran,
		alt: 'Garth crouching in shallow water at a Tagbilaran beach',
		caption: 'Low tide, Tagbilaran',
		span: 'col-span-1 row-span-1 sm:col-span-2 sm:row-span-1',
		position: 'object-[50%_72%]'
	},
	{
		id: 'cebu',
		src: cebu,
		alt: 'Garth sitting under a waterfall in a Cebu canyon',
		caption: 'Cebu — still plotting a way back',
		span: 'col-span-1 row-span-1 sm:col-span-2 sm:row-span-1',
		position: 'object-[50%_68%]'
	}
];
