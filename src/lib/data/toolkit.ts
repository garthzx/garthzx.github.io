/** Skill groups, as on the résumé. */
export const skills = [
	{ group: 'Languages', items: 'TypeScript, JavaScript, C#, Python, SQL, Kotlin' },
	{
		group: 'Backend & APIs',
		items:
			'Node.js, Hono, REST API design, Webhooks, JSON/XML payload parsing, Zod validation, OpenAPI/Swagger, JWT & API-key authentication, ASP.NET Core, .NET'
	},
	{
		group: 'Frontend',
		items:
			'Svelte 5 / SvelteKit, HTML, CSS/SASS, Tailwind CSS, shadcn, Angular, jQuery, Bootstrap, responsive design'
	},
	{
		group: 'Databases',
		items:
			'PostgreSQL (Neon, Supabase), Microsoft SQL Server, Drizzle ORM, Entity Framework, schema design, migrations, stored procedures'
	},
	{
		group: 'Automation & Orchestration',
		items:
			'Inngest durable workflows, BullMQ, Redis queues, saga / compensating-transaction patterns, scheduled jobs, idempotent retry design'
	},
	{
		group: 'Integrations',
		items:
			'Stripe (Connect, Checkout, webhooks, metered billing), Vonage (Voice & Messages APIs, subaccounts, SIP), Twilio, LiveKit, Dentally practice-management API, SMS & transactional email automation'
	},
	{
		group: 'Cloud & DevOps',
		items:
			'AWS (S3, Secrets Manager, KMS), Git & GitHub, Turborepo / pnpm monorepos, Vitest, CI workflows, Vercel / Node deployments'
	}
];

/** A tile in the toolkit field: label, icon key (or null for a text mark), skill-group index. */
export type Tool = [label: string, icon: string | null, group: number];

export const tools: Tool[] = [
	['TypeScript', 'typescript', 0],
	['JavaScript', 'javascript', 0],
	['C#', null, 0],
	['Python', 'python', 0],
	['SQL', null, 0],
	['Kotlin', 'kotlin', 0],
	['Node.js', 'nodedotjs', 1],
	['Hono', 'hono', 1],
	['Zod', 'zod', 1],
	['OpenAPI', 'openapiinitiative', 1],
	['Swagger', 'swagger', 1],
	['JWT', 'jsonwebtokens', 1],
	['.NET', 'dotnet', 1],
	['Svelte', 'svelte', 2],
	['Tailwind CSS', 'tailwindcss', 2],
	['shadcn', 'shadcnui', 2],
	['Angular', 'angular', 2],
	['jQuery', 'jquery', 2],
	['Bootstrap', 'bootstrap', 2],
	['Sass', 'sass', 2],
	['PostgreSQL', 'postgresql', 3],
	['Neon', null, 3],
	['Supabase', 'supabase', 3],
	['SQL Server', null, 3],
	['Drizzle', 'drizzle', 3],
	['Inngest', 'inngest', 4],
	['BullMQ', 'bullmq', 4],
	['Redis', 'redis', 4],
	['Stripe', 'stripe', 5],
	['Vonage', 'vonage', 5],
	['Twilio', 'twilio', 5],
	['LiveKit', 'livekit', 5],
	['AWS', 'amazonwebservices', 6],
	['S3', 'amazons3', 6],
	['Git', 'git', 6],
	['GitHub', 'github', 6],
	['Turborepo', 'turborepo', 6],
	['pnpm', 'pnpm', 6],
	['Vitest', 'vitest', 6],
	['Vercel', 'vercel', 6]
];

/** Short marks for tools without a usable logo. */
export const textMarks: Record<string, string> = {
	'C#': 'C#',
	SQL: 'SQL',
	Neon: 'NEON',
	'SQL Server': 'MSSQL'
};

/** Three concentric orbits; together they hold all 40 tiles. */
export const rings = [
	{ r: 142, n: 9, dur: 110, reverse: false },
	{ r: 218, n: 13, dur: 160, reverse: true },
	{ r: 292, n: 18, dur: 220, reverse: false }
];

/** Side of the square field, in px, before it is scaled to its container. */
export const FIELD = 680;

/** Tools dealt round-robin across groups, so every orbit mixes groups. */
export const orderedTools: Tool[] = (() => {
	const byGroup = skills.map((_, g) => tools.filter((t) => t[2] === g));
	const out: Tool[] = [];
	for (let k = 0; out.length < tools.length; k++) {
		const bucket = byGroup[k % byGroup.length];
		const next = bucket.shift();
		if (next) out.push(next);
	}
	return out;
})();

export const groupCounts = skills.map((_, g) => tools.filter((t) => t[2] === g).length);
