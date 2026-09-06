export const site = {
	name: 'Garth Dustin',
	fullName: 'Garth Dustin P. Ayang-ang',
	role: 'Full-Stack Software Engineer',
	focus: 'Backend Systems & Business Automation',
	location: 'Mandaluyong City, Philippines',
	email: 'garthayangang@outlook.com',
	phone: '+63 915 639 0954',
	phoneHref: '+639156390954',
	company: {
		name: 'Dentalflo AI',
		href: 'https://dentalflo.ai'
	},
	socials: {
		github: 'https://github.com/garthzx',
		linkedin: 'https://www.linkedin.com/in/garth-ayang-ang-378a94262/'
	}
} as const;

export const nav = [
	{ label: 'Work', href: '#work' },
	{ label: 'Projects', href: '#projects' },
	{ label: 'About me', href: '#about' },
	{ label: 'Contact', href: '#contact' }
] as const;
