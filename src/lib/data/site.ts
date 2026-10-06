export const site = {
	url: 'https://garthzx.github.io',
	name: 'Garth Dustin Ayang-ang',
	initials: 'GDA',
	role: 'Full-Stack Software Engineer',
	focus: 'Backend Systems & Business Automation',
	statement: 'I turn manual, staff-driven workflows into durable automated pipelines.',
	city: 'Tuguegarao City',
	country: 'Philippines',
	countryCode: 'PH',
	email: 'garthayangang@outlook.com',
	company: {
		name: 'Dentalflo AI',
		href: 'https://dentalflo.ai'
	},
	resume: {
		href: '/Garth_Dustin_Ayang-ang_Resume.pdf',
		label: 'PDF, 2 pages'
	},
	socials: {
		github: 'https://github.com/garthzx',
		githubHandle: 'garthzx',
		linkedin: 'https://www.linkedin.com/in/garth-dustin-ayang-ang-7335ab324/',
		linkedinHandle: 'garth-dustin-ayang-ang'
	}
} as const;

/** Hero summary strip. */
export const facts = [
	{
		label: 'Focus',
		value: 'Systems architecture, third-party API integration, business process automation'
	},
	{ label: 'Stack', value: 'TypeScript, Node.js, Hono, PostgreSQL, Redis, Inngest' },
	{ label: 'Experience', value: '3+ years building production business systems' },
	{ label: 'Integrations', value: 'Stripe, Vonage, LiveKit, AWS, Dentally' }
] as const;

/** Primary navigation. `num` matches the § number of the section it points at. */
export const nav = [
	{ label: 'Work', id: 'systems', num: '01' },
	{ label: 'Projects', id: 'projects', num: '03' },
	{ label: 'About', id: 'about', num: '05' },
	{ label: 'Contact', id: 'contact', num: '07' }
] as const;
