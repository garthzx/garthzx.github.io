/**
 * Geometry for the architecture diagrams. Coordinates are in each diagram's
 * own viewBox units; the SVG scales to its container.
 *
 *   node kinds  svc   – a service I own
 *               ext   – third-party system (tinted)
 *               store – database / queue (rule under the top edge)
 *               out   – user-visible outcome (double brand border)
 *   edge kinds  happy – the success path (brand, solid)
 *               comp  – compensation / rollback (brass, dashed)
 *               ink   – a plain call or write
 *   status      ok · fail · idle
 */
export type NodeKind = 'svc' | 'ext' | 'store' | 'out';
export type EdgeKind = 'happy' | 'comp' | 'ink';
export type Status = 'ok' | 'fail' | 'idle';

export type DiagramNode = {
	x: number;
	y: number;
	w: number;
	h: number;
	k: NodeKind;
	l: string;
	s: string;
	st?: Status;
};

export type DiagramEdge = {
	p: [number, number][];
	k: EdgeKind;
	/** Label, its position, and text-anchor (defaults to middle). */
	t?: string;
	lx?: number;
	ly?: number;
	a?: 'start' | 'middle' | 'end';
};

export type Diagram = {
	w: number;
	h: number;
	title: string;
	lanes: { y: number; t: string }[];
	nodes: DiagramNode[];
	edges: DiagramEdge[];
	notes: { x: number; y: number; t: string; a?: 'start' | 'middle' | 'end' }[];
};

export type DiagramKind = 'provisioning' | 'telephony' | 'deposits';

export const diagrams: Record<DiagramKind, Diagram> = {
	provisioning: {
		w: 1000,
		h: 376,
		title:
			'Automated tenant provisioning saga. A paid Stripe signup triggers an Inngest workflow that runs five steps: Neon PostgreSQL, AWS Secrets Manager, authentication, schema migrations and transactional email, producing a live clinic workspace. If a step fails, a Redis compensation stack undoes completed steps in reverse.',
		lanes: [],
		nodes: [
			{ x: 20, y: 40, w: 190, h: 60, k: 'ext', l: 'Stripe', s: 'checkout.session.completed' },
			{
				x: 260,
				y: 40,
				w: 230,
				h: 60,
				k: 'svc',
				l: 'Inngest · provision-tenant',
				s: 'durable · idempotent'
			},
			{
				x: 760,
				y: 40,
				w: 220,
				h: 60,
				k: 'out',
				l: 'Live clinic workspace',
				s: 'zero manual setup'
			},
			{
				x: 20,
				y: 170,
				w: 160,
				h: 60,
				k: 'ext',
				l: '01 Neon Postgres',
				s: 'tenant database',
				st: 'ok'
			},
			{
				x: 215,
				y: 170,
				w: 160,
				h: 60,
				k: 'ext',
				l: '02 Secrets Mgr',
				s: 'AWS · credentials',
				st: 'ok'
			},
			{ x: 410, y: 170, w: 160, h: 60, k: 'svc', l: '03 Auth', s: 'authentication', st: 'ok' },
			{
				x: 605,
				y: 170,
				w: 160,
				h: 60,
				k: 'svc',
				l: '04 Migrations',
				s: 'schema migrations',
				st: 'fail'
			},
			{ x: 800, y: 170, w: 160, h: 60, k: 'ext', l: '05 Email', s: 'transactional', st: 'idle' },
			{
				x: 20,
				y: 300,
				w: 940,
				h: 56,
				k: 'store',
				l: 'Redis compensation stack',
				s: 'one undo per completed step · last in, first out'
			}
		],
		edges: [
			{
				p: [
					[210, 70],
					[260, 70]
				],
				k: 'happy',
				t: 'paid',
				lx: 235,
				ly: 62
			},
			{
				p: [
					[375, 100],
					[375, 135],
					[100, 135],
					[100, 170]
				],
				k: 'happy',
				t: 'step.run',
				lx: 237,
				ly: 128
			},
			{
				p: [
					[180, 200],
					[215, 200]
				],
				k: 'happy'
			},
			{
				p: [
					[375, 200],
					[410, 200]
				],
				k: 'happy'
			},
			{
				p: [
					[570, 200],
					[605, 200]
				],
				k: 'happy'
			},
			{
				p: [
					[765, 200],
					[800, 200]
				],
				k: 'happy'
			},
			{
				p: [
					[880, 170],
					[880, 100]
				],
				k: 'happy',
				t: 'ready',
				lx: 888,
				ly: 140,
				a: 'start'
			},
			{
				p: [
					[685, 230],
					[685, 300]
				],
				k: 'comp',
				t: 'fail → unwind',
				lx: 693,
				ly: 270,
				a: 'start'
			},
			{
				p: [
					[490, 300],
					[490, 230]
				],
				k: 'comp',
				t: 'undo 03',
				lx: 498,
				ly: 270,
				a: 'start'
			},
			{
				p: [
					[295, 300],
					[295, 230]
				],
				k: 'comp',
				t: 'undo 02',
				lx: 303,
				ly: 270,
				a: 'start'
			},
			{
				p: [
					[100, 300],
					[100, 230]
				],
				k: 'comp',
				t: 'undo 01',
				lx: 108,
				ly: 270,
				a: 'start'
			}
		],
		notes: []
	},
	telephony: {
		w: 1000,
		h: 414,
		title:
			'Telephony integration. Lane A: a Vonage subaccount-binding saga from the admin portal through application creation, number linking, API user credentials, secrets storage and tenant database writes, with compensation in reverse on failure. Lane B: PSTN calls and SMS arrive through Vonage webhooks handled in Hono; voice bridges into LiveKit SIP, SMS flows through a Redis queue and Inngest to the staff inbox.',
		lanes: [
			{ y: 22, t: 'A · Subaccount binding saga' },
			{ y: 186, t: 'B · Inbound traffic' }
		],
		nodes: [
			{ x: 20, y: 40, w: 142, h: 60, k: 'svc', l: 'Admin portal', s: 'bind number' },
			{ x: 184, y: 40, w: 142, h: 60, k: 'ext', l: 'Application', s: 'Vonage · create', st: 'ok' },
			{ x: 348, y: 40, w: 142, h: 60, k: 'ext', l: 'Number link', s: 'phone → app', st: 'ok' },
			{ x: 512, y: 40, w: 142, h: 60, k: 'ext', l: 'API user', s: 'credentials', st: 'ok' },
			{ x: 676, y: 40, w: 142, h: 60, k: 'ext', l: 'Secrets', s: 'AWS Secrets Mgr', st: 'ok' },
			{ x: 840, y: 40, w: 142, h: 60, k: 'store', l: 'Tenant DB', s: 'binding written', st: 'ok' },
			{ x: 20, y: 204, w: 150, h: 60, k: 'ext', l: 'PSTN caller', s: 'voice · SMS' },
			{ x: 210, y: 204, w: 150, h: 60, k: 'ext', l: 'Vonage', s: 'Messages API' },
			{ x: 400, y: 204, w: 180, h: 60, k: 'svc', l: 'Webhooks · Hono', s: 'voice · SMS · status' },
			{ x: 640, y: 204, w: 160, h: 60, k: 'out', l: 'LiveKit SIP', s: 'PSTN → SIP bridge' },
			{ x: 400, y: 334, w: 180, h: 60, k: 'store', l: 'Redis queue', s: 'inbound SMS' },
			{ x: 620, y: 334, w: 160, h: 60, k: 'svc', l: 'Inngest', s: 'delivery metadata' },
			{ x: 820, y: 334, w: 160, h: 60, k: 'out', l: 'Staff inbox', s: 'per-message state' }
		],
		edges: [
			{
				p: [
					[162, 70],
					[184, 70]
				],
				k: 'happy'
			},
			{
				p: [
					[326, 70],
					[348, 70]
				],
				k: 'happy'
			},
			{
				p: [
					[490, 70],
					[512, 70]
				],
				k: 'happy'
			},
			{
				p: [
					[654, 70],
					[676, 70]
				],
				k: 'happy'
			},
			{
				p: [
					[818, 70],
					[840, 70]
				],
				k: 'happy'
			},
			{
				p: [
					[911, 100],
					[911, 136],
					[255, 136],
					[255, 100]
				],
				k: 'comp',
				t: 'any step fails → compensate in reverse',
				lx: 583,
				ly: 130
			},
			{
				p: [
					[170, 234],
					[210, 234]
				],
				k: 'happy'
			},
			{
				p: [
					[360, 234],
					[400, 234]
				],
				k: 'happy'
			},
			{
				p: [
					[580, 234],
					[640, 234]
				],
				k: 'happy',
				t: 'voice',
				lx: 610,
				ly: 226
			},
			{
				p: [
					[490, 264],
					[490, 334]
				],
				k: 'happy',
				t: 'SMS',
				lx: 498,
				ly: 304,
				a: 'start'
			},
			{
				p: [
					[580, 364],
					[620, 364]
				],
				k: 'happy'
			},
			{
				p: [
					[780, 364],
					[820, 364]
				],
				k: 'happy'
			}
		],
		notes: [{ x: 285, y: 286, t: 'migrated from Voice API, all tenants', a: 'middle' }]
	},
	deposits: {
		w: 1000,
		h: 360,
		title:
			'Stripe Connect booking deposits. A booking made by SMS or phone calls the deposit service, which creates a Checkout session on the clinic connected account and sends a branded short link. The patient pays in Stripe Checkout; a signature-verified webhook marks the payment in PostgreSQL and writes status back to the Dentally practice-management system. When the patient attends, pending links are voided.',
		lanes: [],
		nodes: [
			{ x: 20, y: 56, w: 160, h: 60, k: 'svc', l: 'Booking', s: 'SMS or phone' },
			{ x: 220, y: 56, w: 170, h: 60, k: 'svc', l: 'Deposit service', s: 'Connect account' },
			{ x: 430, y: 56, w: 160, h: 60, k: 'svc', l: 'Short link', s: 'branded' },
			{ x: 630, y: 56, w: 150, h: 60, k: 'ext', l: 'Patient', s: 'pays from SMS' },
			{ x: 820, y: 56, w: 160, h: 60, k: 'ext', l: 'Stripe Checkout', s: 'enforced expiry' },
			{ x: 220, y: 216, w: 170, h: 60, k: 'store', l: 'PostgreSQL', s: 'one link per appt' },
			{ x: 590, y: 216, w: 180, h: 60, k: 'svc', l: 'Webhook handler', s: 'signature verified' },
			{ x: 810, y: 216, w: 170, h: 60, k: 'out', l: 'Dentally PMS', s: 'status write-back' }
		],
		edges: [
			{
				p: [
					[180, 86],
					[220, 86]
				],
				k: 'happy'
			},
			{
				p: [
					[390, 86],
					[430, 86]
				],
				k: 'happy'
			},
			{
				p: [
					[590, 86],
					[630, 86]
				],
				k: 'happy',
				t: 'SMS',
				lx: 610,
				ly: 78
			},
			{
				p: [
					[780, 86],
					[820, 86]
				],
				k: 'happy'
			},
			{
				p: [
					[305, 56],
					[305, 24],
					[900, 24],
					[900, 56]
				],
				k: 'ink',
				t: 'create Checkout session',
				lx: 602,
				ly: 18
			},
			{
				p: [
					[900, 116],
					[900, 166],
					[680, 166],
					[680, 216]
				],
				k: 'happy',
				t: 'webhook',
				lx: 790,
				ly: 160
			},
			{
				p: [
					[770, 246],
					[810, 246]
				],
				k: 'happy'
			},
			{
				p: [
					[590, 246],
					[390, 246]
				],
				k: 'ink',
				t: 'mark paid',
				lx: 490,
				ly: 238
			},
			{
				p: [
					[305, 116],
					[305, 216]
				],
				k: 'ink',
				t: 'unique index',
				lx: 313,
				ly: 170,
				a: 'start'
			},
			{
				p: [
					[895, 276],
					[895, 330],
					[305, 330],
					[305, 276]
				],
				k: 'comp',
				t: 'patient attended → void pending link',
				lx: 600,
				ly: 324
			}
		],
		notes: []
	}
};
