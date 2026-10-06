import soilHero from '$lib/assets/projects/soil-mates-hero.jpg';
import soilCatalogue from '$lib/assets/projects/soil-mates-catalogue.jpg';
import gelic from '$lib/assets/projects/gelic.png';
import extrack from '$lib/assets/projects/extrack.png';
import doodle from '$lib/assets/projects/doodle.png';

export const featured = {
	title: 'Soil Mates',
	year: '2026',
	description:
		'An online plant store, front to back: catalogue with sale pricing, cart, wishlist and side-by-side comparison. Svelte 5 on the front, a Hono API behind it, Neon Postgres for data, and Better Auth handling accounts.',
	tech: ['Svelte 5', 'Hono', 'Neon', 'Better Auth', 'TypeScript'],
	href: 'https://github.com/garthzx/Soil-Mates',
	slides: [
		{
			src: soilHero,
			alt: 'Soil Mates hero: plants, pots and the dirt in between',
			caption: 'Landing hero'
		},
		{
			src: soilCatalogue,
			alt: 'Soil Mates new arrivals product grid with sale pricing',
			caption: 'Product catalogue with sale pricing'
		}
	]
};

/** A typographic plate stands in for projects with no screenshot. */
export type Plate = { top: string; mid: string; lines: string[] };

export type Project = {
	title: string;
	year: string;
	description: string;
	tech: string[];
	href: string;
	linkLabel: string;
	alt: string;
	image?: string;
	plate?: Plate;
};

export const projects: Project[] = [
	{
		title: 'Retinal Disease Classification',
		year: '2024',
		alt: 'Typographic plate: undergraduate thesis, paper accepted at ICITE 2023',
		plate: {
			top: 'Thesis · Paper',
			mid: 'Multi-label classification of retinal disease from fundus images',
			lines: ['ICITE 2023', 'Boracay, PH', 'Python']
		},
		description:
			'Undergraduate thesis on a heavily class-imbalanced fundus image dataset. The accompanying paper was accepted at ICITE 2023 in Boracay.',
		tech: ['Python', 'Deep Learning', 'Computer Vision'],
		href: 'http://urdc.usl.edu.ph/journals/jeai/papers/vol3/vol%203%20series%202023-41-46.pdf',
		linkLabel: 'Read the paper'
	},
	{
		title: 'iSkor',
		year: '2023',
		alt: 'Typographic plate: iSkor, university events management system',
		plate: {
			top: 'University system',
			mid: 'Event creation, scheduling and attendance',
			lines: ['ASP.NET Core', 'C#', 'MS SQL Server']
		},
		description:
			'An events management system built for university-wide use: event creation, scheduling, and attendance handling, built in ASP.NET Core.',
		tech: ['ASP.NET Core', 'C#', 'MS SQL Server', 'Bootstrap'],
		href: 'https://github.com/garthzx/iSkor',
		linkLabel: 'GitHub'
	},
	{
		title: 'Gelic',
		year: '2023',
		image: gelic,
		alt: 'Gelic source code and interpreter output in a terminal',
		description:
			'A dynamically typed programming language with C-style syntax, written from scratch in Python 3. Supports arithmetic operations, conditional statements, and loops.',
		tech: ['Python'],
		href: 'https://github.com/garthzx/gelic',
		linkLabel: 'GitHub'
	},
	{
		title: 'ExTrack',
		year: '2023',
		image: extrack,
		alt: 'ExTrack dashboard with expense charts',
		description:
			'An expense tracker written in ASP.NET Core MVC, with Bootstrap 5 and Syncfusion for the reporting and charting layer.',
		tech: ['ASP.NET MVC', 'C#', 'Bootstrap', 'Syncfusion'],
		href: 'https://github.com/garthzx/ExTrack',
		linkLabel: 'GitHub'
	},
	{
		title: 'Doodle',
		year: '2022',
		image: doodle,
		alt: 'Doodle search engine results page',
		description:
			'A search engine in the shape of Google’s: crawling, indexing, and ranking sites and images out of a MySQL database.',
		tech: ['PHP', 'MySQL', 'JavaScript', 'CSS3'],
		href: 'https://github.com/garthzx/doodle',
		linkLabel: 'GitHub'
	}
];
