export type Role = {
	id: string;
	current?: boolean;
	dates: string;
	place: string;
	title: string;
	company: string;
	intro?: string;
	bullets: string[];
};

export const roles: Role[] = [
	{
		id: 'dentalflo',
		current: true,
		dates: 'Aug 2025 – Present',
		place: 'Remote · Australia',
		title: 'Full-Stack Software Engineer',
		company: 'Dentalflo AI',
		intro:
			'Backend-focused engineer on a multi-tenant dental practice-management and patient-communication platform (TypeScript, Hono, SvelteKit, PostgreSQL, Redis, BullMQ, Inngest). Personally own tenant provisioning, telephony integration, and online payments.',
		bullets: [
			'Architected and shipped the platform’s automated tenant provisioning pipeline — a durable, idempotent saga spanning five external systems (Neon PostgreSQL, AWS Secrets Manager, authentication, schema migrations, transactional email) that converts a paid signup into a fully configured, live clinic workspace with zero manual setup by internal staff.',
			'Built the Stripe Connect booking-deposit system, allowing patients to pay a deposit directly from an SMS or phone booking — removing manual invoicing and deposit chase-up calls from front-desk staff.',
			'Implemented the Vonage telephony integration end to end: a subaccount-binding saga with full compensating actions, plus inbound voice, SMS, and delivery-status webhooks that bridge PSTN calls into LiveKit SIP.',
			'Designed a Redis-backed compensation (rollback) stack so any failed provisioning step automatically unwinds every step already completed, eliminating half-created tenants and the manual cleanup they previously required; behavior is covered by unit tests.',
			'Re-platformed provisioning from a seven-job BullMQ flow onto Inngest durable execution, giving each step independent retries and a single declarative failure handler — removing seven copies of duplicated error handling and making signup resilient to Stripe webhook retries.',
			'Migrated the platform from the legacy Vonage Voice API to the Messages API across all tenants, including a per-tenant capability declaration and a backfill script, retiring the deprecated webhook configuration without customer downtime.',
			'Hardened the payment flow against duplicate and orphaned charges: enforced one payment link per appointment (unique index plus de-duplication migration), auto-voided pending links once a patient attends, synchronized deposit prices from Stripe, and automatically disabled deposit collection when a clinic disconnects its Stripe account.',
			'Rebuilt inbound SMS handling on a Redis queue and Inngest pipeline with typed delivery metadata, surfacing per-message delivery state directly in the staff conversation view and replacing a fragile single-worker design.',
			'Built the internal admin portal in SvelteKit — real-time provisioning and deprovisioning progress over server-sent events, tenant lifecycle controls, phone-number binding, and self-service password reset across two applications — reducing engineer involvement in day-to-day account operations.',
			'Shipped the public marketing site in SvelteKit, including page structure, SEO metadata, pricing pages, and performance/loading behavior, connecting the customer-facing front end to the same backend that provisions accounts.'
		]
	},
	{
		id: 'tropical',
		dates: 'Sep 2024 – Aug 2025',
		place: 'Pasig City, PH',
		title: 'Software Engineer / Business Analyst',
		company: 'Tropical Focus Philippines Inc.',
		bullets: [
			'Integrated enterprise building-automation software with IoT devices and sensors, collecting real-time telemetry into Microsoft SQL Server to drive energy-cost optimization across large-scale commercial buildings.',
			'Served as both developer and business analyst: gathered requirements directly from mechanical engineers, energy consultants, and project managers, then translated operational problems into technical specifications and shipped them in C# / ASP.NET Core.',
			'Delivered data-access and reporting layers with stored procedures and Entity Framework, and worked cross-functionally to tailor deployments to each client site.'
		]
	},
	{
		id: 'scaleup',
		dates: 'Jun 2023 – Dec 2023',
		place: 'Quezon City, PH',
		title: 'Web Developer (Part-Time) / Web Development Intern',
		company: 'ScaleUp Solutions, Inc.',
		bullets: [
			'Integrated ERP systems with e-commerce platforms so product, order, and inventory data flowed between them automatically, eliminating duplicate manual entry for client staff.',
			'Built responsive, mobile-friendly storefront interfaces with HTML, SASS, JavaScript, ASP.NET Core, jQuery, and Bootstrap, applying modern UX practices to improve usability.',
			'Worked directly with clients to capture business requirements and report project progress.'
		]
	}
];

export const recognition = [
	{
		when: '2020 – 2024',
		title: 'BS Computer Science, Cum Laude',
		detail:
			'University of Saint Louis Tuguegarao, Tuguegarao City. Thesis on multi-label retinal disease classification on a high-class-imbalanced fundus image dataset.'
	},
	{
		when: 'November 2023',
		title: 'Paper accepted at ICITE 2023',
		detail:
			'AI research paper at the International Conference on Information Technology and Education, Boracay, Philippines.'
	},
	{
		when: 'October 2022',
		title: '2nd place, DICT Philippine Startup Challenge 7',
		detail: 'Regional Pitching Competition.'
	}
];
