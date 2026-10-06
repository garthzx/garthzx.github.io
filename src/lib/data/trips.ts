import sagada1 from '$lib/assets/trips/sagada-1.jpg';
import sagada2 from '$lib/assets/trips/sagada-2.jpg';
import sagada3 from '$lib/assets/trips/sagada-3.jpg';
import elNido1 from '$lib/assets/trips/el-nido-1.jpg';
import elNido2 from '$lib/assets/trips/el-nido-2.jpg';
import elNido3 from '$lib/assets/trips/el-nido-3.jpg';
import bohol1 from '$lib/assets/trips/bohol-1.jpg';
import bohol2 from '$lib/assets/trips/bohol-2.jpg';
import kawasan2 from '$lib/assets/trips/kawasan-2.jpg';
import tagbilaran from '$lib/assets/tagbilaran.jpg';
import fam from '$lib/assets/fam.jpg';

export type Stop = { place: string; region: string; lat: number; lon: number };

export const stops: Stop[] = [
	{ place: 'Sagada', region: 'Mountain Province', lat: 17.08, lon: 120.9 },
	{ place: 'El Nido', region: 'Palawan', lat: 11.18, lon: 119.39 },
	{ place: 'Bohol', region: 'Tagbilaran · Chocolate Hills', lat: 9.65, lon: 123.85 },
	{ place: 'Kawasan Falls', region: 'Cebu · Canyoneering', lat: 9.81, lon: 123.37 }
];

export type Photo = { stop: number; src: string; alt: string; caption: string; pos: string };

export const photos: Photo[] = [
	{
		stop: 0,
		src: sagada1,
		alt: 'Morning fog filling the valleys below pine trees in Sagada',
		caption: 'Sea of clouds below the pines',
		pos: '50% 50%'
	},
	{
		stop: 0,
		src: sagada2,
		alt: 'Garth standing on a rocky summit above a valley of clouds in Sagada',
		caption: 'Standing over the cloud line',
		pos: '50% 60%'
	},
	{
		stop: 0,
		src: sagada3,
		alt: 'Pale blue-grey rock formations below a pine forest in Sagada',
		caption: 'Pale rock under the pines',
		pos: '50% 62%'
	},
	{
		stop: 1,
		src: elNido1,
		alt: 'Garth paddling a kayak toward limestone cliffs in El Nido',
		caption: 'Paddling in toward the karst',
		pos: '50% 45%'
	},
	{
		stop: 1,
		src: elNido2,
		alt: 'Kayaks on turquoise water below a forested limestone island in El Nido',
		caption: 'Turquoise lagoon, kayaks at the cliff foot',
		pos: '50% 60%'
	},
	{
		stop: 1,
		src: elNido3,
		alt: 'A dog walking on a beach framed by trees, islands on the horizon in El Nido',
		caption: 'Beach through the trees',
		pos: '50% 55%'
	},
	{
		stop: 2,
		src: bohol2,
		alt: 'The Chocolate Hills rising beyond golden rice fields in Bohol',
		caption: 'Chocolate Hills over the rice fields',
		pos: '50% 60%'
	},
	{
		stop: 2,
		src: bohol1,
		alt: 'Outrigger boats moored off a Bohol beach at golden hour, people walking on the sand',
		caption: 'Outrigger boats at golden hour',
		pos: '50% 55%'
	},
	{
		stop: 2,
		src: tagbilaran,
		alt: 'Garth crouching in shallow water at a Tagbilaran beach at low tide',
		caption: 'Low tide, Tagbilaran',
		pos: '50% 70%'
	},
	{
		stop: 3,
		src: kawasan2,
		alt: 'Garth and family in helmets floating in a turquoise canyon pool at Kawasan Falls',
		caption: 'Turquoise pool deep in the canyon',
		pos: '50% 60%'
	},
	{
		stop: 3,
		src: fam,
		alt: 'Garth and family swimming in a pool during canyoneering at Kawasan Falls, Cebu',
		caption: 'Canyoneering with family',
		pos: '50% 62%'
	}
];

/** [left, top, width, height], as percentages of the stage. */
type Rect = [number, number, number, number];

/** Wide layout: each stop's photos, plus the caption card that fills the gap. */
export const slotsWide: { ph: Rect[]; card: Rect }[] = [
	{
		ph: [
			[0, 0, 63, 59],
			[66, 0, 34, 100],
			[0, 62, 30, 38]
		],
		card: [33, 62, 30, 38]
	},
	{
		ph: [
			[0, 0, 40, 100],
			[43, 0, 30, 58],
			[76, 0, 24, 58]
		],
		card: [43, 62, 57, 38]
	},
	{
		ph: [
			[0, 0, 64, 56],
			[67, 0, 33, 100],
			[0, 60, 26, 40]
		],
		card: [30, 60, 34, 40]
	},
	{
		ph: [
			[0, 0, 100, 58],
			[0, 62, 44, 38]
		],
		card: [48, 62, 52, 38]
	}
];

/** Compact layout: photos only; the caption moves below the stage. */
export const slotsCompact: { ph: Rect[] }[] = [
	{
		ph: [
			[0, 0, 100, 52],
			[0, 55, 48.5, 45],
			[51.5, 55, 48.5, 45]
		]
	},
	{
		ph: [
			[0, 0, 56, 100],
			[59, 0, 41, 48.5],
			[59, 51.5, 41, 48.5]
		]
	},
	{
		ph: [
			[0, 0, 100, 52],
			[0, 55, 48.5, 45],
			[51.5, 55, 48.5, 45]
		]
	},
	{
		ph: [
			[0, 0, 100, 48.5],
			[0, 51.5, 100, 48.5]
		]
	}
];

/** "01.2": stop number, then the photo's position within that stop. */
export function plateOf(i: number): string {
	const stop = photos[i].stop;
	const k = photos.filter((p, j) => p.stop === stop && j <= i).length;
	return `0${stop + 1}.${k}`;
}

export function coordsOf(s: Stop): string {
	return `${s.lat.toFixed(2)}° N · ${s.lon.toFixed(2)}° E`;
}
