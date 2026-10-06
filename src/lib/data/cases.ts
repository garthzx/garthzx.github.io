import type { DiagramKind } from './diagrams';

export type CaseStudy = {
	slug: DiagramKind;
	num: string;
	title: string;
	/** Figure caption under the diagram. */
	fig: string;
	summary: string;
	/** Home page: the two outcomes shown under the summary. */
	outcomes: string[];
	/** Home page tags. */
	tags: string[];
	/** Case study page: the "Stack" row in the header strip. */
	stack: string[];
	context: string;
	problem: string[];
	archNote: string;
	built: { h: string; p: string }[];
	outcome: string[];
};

export const cases: CaseStudy[] = [
	{
		slug: 'provisioning',
		num: '01',
		title: 'Automated tenant provisioning',
		fig: 'Provisioning saga, shown with step 04 failing',
		summary:
			'A paid Stripe signup triggers a durable, idempotent saga across five systems and produces a live clinic workspace with zero manual setup by internal staff.',
		outcomes: [
			'A Redis-backed compensation stack unwinds every completed step if one fails, eliminating half-created tenants.',
			'Re-platformed from a seven-job BullMQ flow onto Inngest: independent retries per step and a single declarative failure handler.'
		],
		tags: ['Inngest', 'BullMQ', 'Redis', 'Neon PostgreSQL', 'AWS Secrets Manager', 'Stripe'],
		stack: ['Inngest', 'BullMQ', 'Redis', 'Neon PostgreSQL', 'AWS Secrets Manager', 'Stripe'],
		context:
			'Dentalflo AI is a multi-tenant dental practice-management and patient-communication platform built on TypeScript, Hono, SvelteKit, PostgreSQL, Redis, BullMQ and Inngest. I personally own tenant provisioning, telephony integration and online payments. Provisioning is the step that turns a paid signup into a fully configured, live clinic workspace.',
		problem: [
			'Provisioning a clinic spans five external systems: Neon PostgreSQL, AWS Secrets Manager, authentication, schema migrations and transactional email.',
			'A failure partway through left a half-created tenant that had to be cleaned up manually.',
			'The original seven-job BullMQ flow carried seven copies of duplicated error handling, and signup had to stay correct when Stripe retried its webhooks.'
		],
		archNote:
			'Each step runs as an independently retried Inngest step. Every completed step pushes its undo onto a Redis-backed stack; the diagram shows the rollback path when step 04 fails.',
		built: [
			{
				h: 'A durable, idempotent saga',
				p: 'Architected and shipped the provisioning pipeline as a saga spanning five external systems, converting a paid signup into a fully configured, live clinic workspace with zero manual setup by internal staff.'
			},
			{
				h: 'A Redis-backed compensation stack',
				p: 'Any failed provisioning step automatically unwinds every step already completed, eliminating half-created tenants and the manual cleanup they previously required. The behavior is covered by unit tests.'
			},
			{
				h: 'Re-platformed from BullMQ onto Inngest',
				p: 'Moved provisioning from a seven-job BullMQ flow onto Inngest durable execution, giving each step independent retries and a single declarative failure handler.'
			},
			{
				h: 'Live progress in the admin portal',
				p: 'The internal SvelteKit admin portal shows real-time provisioning and deprovisioning progress over server-sent events, alongside tenant lifecycle controls.'
			}
		],
		outcome: [
			'Zero manual setup by internal staff for a new clinic workspace.',
			'No half-created tenants and no manual cleanup after a failed step.',
			'Seven copies of duplicated error handling removed.',
			'Signup is resilient to Stripe webhook retries.'
		]
	},
	{
		slug: 'telephony',
		num: '02',
		title: 'Telephony integration',
		fig: 'Subaccount binding and inbound traffic',
		summary:
			'A Vonage subaccount-binding saga with full compensating actions, plus inbound voice, SMS and delivery-status webhooks that bridge PSTN calls into LiveKit SIP.',
		outcomes: [
			'Migrated every tenant from the Voice API to the Messages API without customer downtime.',
			'Rebuilt inbound SMS on a Redis queue and Inngest pipeline, with per-message delivery state in the staff conversation view.'
		],
		tags: ['Vonage', 'LiveKit SIP', 'Hono', 'Redis', 'Inngest', 'AWS'],
		stack: ['Vonage', 'LiveKit SIP', 'Hono', 'Redis', 'Inngest', 'AWS Secrets Manager'],
		context:
			'Dentalflo AI is a multi-tenant dental practice-management and patient-communication platform. I implemented the Vonage telephony integration end to end, from binding a clinic’s phone number to handling the calls and messages that arrive on it.',
		problem: [
			'Binding a clinic means application creation, phone-number linking, API user and credential provisioning, secrets storage and tenant-database writes. Each is a separate write that must be undone if a later one fails.',
			'Inbound calls arrive from the public phone network and have to be bridged into LiveKit SIP.',
			'The legacy Voice API webhook configuration was deprecated, and inbound SMS ran on a fragile single-worker design.'
		],
		archNote:
			'Lane A is the binding saga, with compensation in reverse. Lane B is runtime traffic: voice bridges into LiveKit SIP; SMS moves through a Redis queue and Inngest to the staff conversation view.',
		built: [
			{
				h: 'Subaccount-binding saga',
				p: 'Application creation, phone-number linking, API user and credential provisioning, secrets storage and tenant-database writes, each with a full compensating action.'
			},
			{
				h: 'Inbound webhooks',
				p: 'Inbound voice, SMS and delivery-status webhooks that bridge PSTN calls into LiveKit SIP.'
			},
			{
				h: 'Voice API to Messages API migration',
				p: 'Migrated all tenants from the legacy Vonage Voice API to the Messages API, with a per-tenant capability declaration and a backfill script, retiring the deprecated webhook configuration.'
			},
			{
				h: 'Inbound SMS pipeline',
				p: 'Rebuilt inbound SMS handling on a Redis queue and Inngest pipeline with typed delivery metadata.'
			}
		],
		outcome: [
			'Every tenant moved to the Messages API without customer downtime.',
			'Per-message delivery state shown directly in the staff conversation view.',
			'The fragile single-worker SMS design replaced.',
			'Phone-number binding available from the internal admin portal.'
		]
	},
	{
		slug: 'deposits',
		num: '03',
		title: 'Stripe Connect booking deposits',
		fig: 'Deposit from booking to practice-management write-back',
		summary:
			'Patients pay a deposit straight from an SMS or phone booking, and payment status writes back to the clinic’s practice-management system automatically.',
		outcomes: [
			'Removed manual invoicing and deposit chase-up calls from front-desk staff.',
			'Hardened against duplicate and orphaned charges: one payment link per appointment, auto-voided once the patient attends.'
		],
		tags: ['Stripe Connect', 'Checkout', 'Webhooks', 'Dentally API', 'PostgreSQL'],
		stack: ['Stripe Connect', 'Checkout', 'Webhooks', 'Dentally API', 'PostgreSQL'],
		context:
			'Dentalflo AI is a multi-tenant dental practice-management and patient-communication platform. I own online payments, including the booking-deposit system that lets patients pay a deposit directly from an SMS or phone booking.',
		problem: [
			'Front-desk staff handled deposits with manual invoicing and chase-up calls.',
			'Payment status and appointment state needed to reach each clinic’s practice-management system.',
			'The flow had to be protected against duplicate and orphaned charges.'
		],
		archNote:
			'The deposit service creates a Checkout session on the clinic’s connected account and sends a branded short link. A signature-verified webhook records the payment and writes back to the practice-management system.',
		built: [
			{
				h: 'Connected-account onboarding',
				p: 'Stripe Connect onboarding for each clinic, with country and currency handling.'
			},
			{
				h: 'Checkout and short links',
				p: 'Checkout sessions with enforced expiry windows, sent to patients as branded short payment links.'
			},
			{
				h: 'Verified webhooks and write-back',
				p: 'Signature-verified webhooks with automatic write-back of payment status and appointment state to the clinic’s practice-management system.'
			},
			{
				h: 'Hardening',
				p: 'One payment link per appointment (unique index plus de-duplication migration), pending links auto-voided once a patient attends, deposit prices synchronized from Stripe, and deposit collection disabled automatically when a clinic disconnects its Stripe account.'
			}
		],
		outcome: [
			'Manual invoicing and deposit chase-up calls removed from front-desk staff.',
			'One payment link per appointment, enforced in the database.',
			'Pending links voided automatically once the patient attends.',
			'Deposit collection switches off when a clinic disconnects Stripe.'
		]
	}
];

export const caseHref = (slug: string) => `/work/${slug}`;
