import type { ArtName } from '$lib/components/ProjectArt.svelte';
import doodle from '$lib/assets/projects/doodle.png';
import gelic from '$lib/assets/projects/gelic.png';
import extrack from '$lib/assets/projects/extrack.png';

export type Project = {
	id: string;
	title: string;
	blurb: string;
	description: string;
	image?: string;
	/** Vector artwork drawn in place of a screenshot. */
	art?: ArtName;
	techUsed: string[];
	/** Where the project lives — a repository, or the published paper. */
	link?: { href: string; kind: 'github' | 'paper'; label: string };
	note?: string;
	year: string;
};

export const projects: Project[] = [
	{
		id: 'retinal',
		title: 'Retinal Disease Classification',
		blurb: 'Undergraduate thesis — accepted at ICITE 2023.',
		description:
			'Multi-label classification of retinal disease from fundus images on a heavily class-imbalanced dataset. The work behind the accompanying paper accepted at ICITE 2023 in Boracay.',
		art: 'retina',
		techUsed: ['Python', 'Deep Learning', 'Computer Vision'],
		link: {
			href: 'http://urdc.usl.edu.ph/journals/jeai/papers/vol3/vol%203%20series%202023-41-46.pdf',
			kind: 'paper',
			label: 'Read the published paper (PDF)'
		},
		note: 'Paper — ICITE 2023',
		year: '2024'
	},
	{
		id: 'iskor',
		title: 'iSkor',
		blurb: 'Events management for a university.',
		description:
			'An events management system built for university-wide use — event creation, scheduling, and attendance handling, built in ASP.NET Core.',
		art: 'scoreboard',
		techUsed: ['ASP.NET Core', 'C#', 'MS SQL Server', 'Bootstrap'],
		link: { href: 'https://github.com/garthzx/iSkor', kind: 'github', label: 'iSkor on GitHub' },
		year: '2023'
	},
	{
		id: 'gelic',
		title: 'Gelic',
		blurb: 'A dynamically typed, C-syntax language.',
		description:
			'A dynamically typed programming language with C-style syntax, written from scratch in Python 3. Supports arithmetic operations, conditional statements, and loops.',
		image: gelic,
		techUsed: ['Python'],
		link: { href: 'https://github.com/garthzx/gelic', kind: 'github', label: 'Gelic on GitHub' },
		year: '2023'
	},
	{
		id: 'extrack',
		title: 'ExTrack',
		blurb: 'Expense tracking with reporting built in.',
		description:
			'An expense tracker application written in ASP.NET Core MVC, with Bootstrap 5 and Syncfusion for the reporting and charting layer.',
		image: extrack,
		techUsed: ['ASP.NET MVC', 'C#', 'Bootstrap', 'Syncfusion'],
		link: {
			href: 'https://github.com/garthzx/ExTrack',
			kind: 'github',
			label: 'ExTrack on GitHub'
		},
		year: '2023'
	},
	{
		id: 'doodle',
		title: 'Doodle',
		blurb: 'A search engine, built the long way round.',
		description:
			'A search engine in the shape of Google’s — crawling, indexing, and ranking sites and images out of a MySQL database.',
		image: doodle,
		techUsed: ['PHP', 'MySQL', 'JavaScript', 'CSS3'],
		link: { href: 'https://github.com/garthzx/doodle', kind: 'github', label: 'Doodle on GitHub' },
		year: '2022'
	}
];
