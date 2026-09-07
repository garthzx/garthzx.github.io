export type Role = {
	id: string;
	company: string;
	href?: string;
	title: string;
	location: string;
	period: string;
	current?: boolean;
	summary: string;
	highlights: string[];
	stack: string[];
};

export const experience: Role[] = [
	{
		id: 'dentalflo',
		company: 'Dentalflo AI',
		href: 'https://dentalflo.ai',
		title: 'Full-Stack Software Engineer',
		location: 'Remote — Australia',
		period: 'Aug 2025 — Present',
		current: true,
		summary:
			'Backend-focused engineer on a multi-tenant dental practice-management and patient-communication platform. I personally own tenant provisioning, telephony integration, and online payments.',
		highlights: [
			'Architected the automated tenant provisioning pipeline — a durable, idempotent saga across five external systems (Neon PostgreSQL, AWS Secrets Manager, auth, schema migrations, transactional email) that turns a paid signup into a live clinic workspace with zero manual setup.',
			'Designed a Redis-backed compensation stack so any failed provisioning step unwinds everything already completed, eliminating half-created tenants and the manual cleanup they used to need.',
			'Re-platformed provisioning from a seven-job BullMQ flow onto Inngest durable execution — independent retries per step and one declarative failure handler, replacing seven copies of duplicated error handling.',
			'Implemented the Vonage telephony integration end to end: a subaccount-binding saga with full compensating actions, plus inbound voice, SMS, and delivery-status webhooks bridging PSTN calls into LiveKit SIP.',
			'Migrated every tenant from the legacy Vonage Voice API to the Messages API, with per-tenant capability declaration and a backfill script — no customer downtime.',
			'Built the Stripe Connect booking-deposit system: connected-account onboarding, Checkout sessions with enforced expiry, branded short payment links, signature-verified webhooks, and automatic write-back of payment and appointment state to the clinic’s practice-management system.',
			'Hardened payments against duplicate and orphaned charges — one payment link per appointment, auto-voiding on attendance, price sync from Stripe, and auto-disabling deposits when a clinic disconnects.',
			'Rebuilt inbound SMS on a Redis queue and Inngest pipeline with typed delivery metadata, surfacing per-message delivery state in the staff conversation view.',
			'Built the internal admin portal in SvelteKit with real-time provisioning progress over server-sent events, and shipped the public marketing site including SEO and pricing pages.'
		],
		stack: [
			'TypeScript',
			'Hono',
			'SvelteKit',
			'PostgreSQL',
			'Drizzle',
			'Redis',
			'BullMQ',
			'Inngest',
			'Stripe',
			'Vonage',
			'LiveKit',
			'AWS'
		]
	},
	{
		id: 'tropical-focus',
		company: 'Tropical Focus Philippines Inc.',
		title: 'Software Engineer / Business Analyst',
		location: 'Pasig City, Philippines',
		period: 'Sep 2024 — Aug 2025',
		summary:
			'Integrated enterprise building-automation software with IoT devices and sensors, collecting real-time telemetry to drive energy-cost optimisation across large commercial buildings.',
		highlights: [
			'Collected real-time telemetry from IoT devices and sensors into Microsoft SQL Server to drive energy-cost optimisation across large-scale commercial buildings.',
			'Worked as both developer and business analyst — gathering requirements directly from mechanical engineers, energy consultants, and project managers, then translating operational problems into specs and shipping them in C# / ASP.NET Core.',
			'Delivered data-access and reporting layers with stored procedures and Entity Framework, tailoring deployments to each client site.'
		],
		stack: ['C#', 'ASP.NET Core', 'Entity Framework', 'MS SQL Server', 'IoT']
	},
	{
		id: 'scaleup',
		company: 'ScaleUp Solutions, Inc.',
		title: 'Web Developer (Part-Time) / Web Development Intern',
		location: 'Quezon City, Philippines',
		period: 'Jun 2023 — Dec 2023',
		summary:
			'Connected ERP systems to e-commerce platforms and built the storefronts customers actually shopped on.',
		highlights: [
			'Integrated ERP systems with e-commerce platforms so product, order, and inventory data flowed automatically, eliminating duplicate manual entry for client staff.',
			'Built responsive, mobile-friendly storefront interfaces with HTML, SASS, JavaScript, ASP.NET Core, jQuery, and Bootstrap.',
			'Worked directly with clients to capture business requirements and report project progress.'
		],
		stack: ['ASP.NET Core', 'JavaScript', 'SASS', 'jQuery', 'Bootstrap']
	}
];

export const education = {
	school: 'University of Saint Louis Tuguegarao',
	location: 'Tuguegarao City, Philippines',
	period: '2020 — 2024',
	degree: 'BS Computer Science',
	honors: 'Cum Laude',
	thesis:
		'Multi-label retinal disease classification on a high-class-imbalanced fundus image dataset (Python).'
};

export const achievements = [
	{
		title: 'AI research paper accepted at ICITE 2023',
		detail:
			'International Conference on Information Technology and Education — Boracay, Philippines',
		date: 'Nov 2023'
	},
	{
		title: 'Ranked 2nd — DICT Philippine Startup Challenge 7',
		detail: 'Regional Pitching Competition',
		date: 'Oct 2022'
	}
];

export const skillGroups = [
	{
		label: 'Languages',
		items: ['TypeScript', 'JavaScript', 'C#', 'Python', 'SQL', 'Kotlin']
	},
	{
		label: 'Backend & APIs',
		items: [
			'Node.js',
			'Hono',
			'REST API design',
			'Webhooks',
			'Zod',
			'OpenAPI',
			'JWT',
			'Better Auth',
			'ASP.NET Core'
		]
	},
	{
		label: 'Frontend',
		items: ['Svelte 5', 'SvelteKit', 'Tailwind CSS', 'shadcn', 'Angular', 'SASS', 'Bootstrap']
	},
	{
		label: 'Databases',
		items: ['PostgreSQL', 'Neon', 'Supabase', 'MS SQL Server', 'Drizzle ORM', 'Entity Framework']
	},
	{
		label: 'Automation',
		items: ['Inngest', 'BullMQ', 'Redis queues', 'Saga patterns', 'Idempotent retries']
	},
	{
		label: 'Integrations',
		items: ['Stripe Connect', 'Vonage', 'Twilio', 'LiveKit', 'Dentally API']
	},
	{
		label: 'Cloud & DevOps',
		items: ['AWS S3', 'Secrets Manager', 'KMS', 'Turborepo', 'pnpm', 'Vitest', 'Vercel']
	}
];
