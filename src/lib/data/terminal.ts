import { site } from './site';

/** A single rendered line inside a JSON-ish command output. */
export type OutputLine =
	| { kind: 'brace'; text: string }
	| { kind: 'pair'; key: string; value: string; href?: string; last?: boolean }
	| { kind: 'plain'; text: string };

export type Block = {
	/** Directory shown in the prompt for this command. */
	cwd: string;
	command: string;
	output?: OutputLine[];
};

type Pair = Extract<OutputLine, { kind: 'pair' }>;

const pair = (key: string, value: string, href?: string): Pair => ({
	kind: 'pair',
	key,
	value,
	href
});

export const user = 'garth';
export const host = 'dentalflo';

export const blocks: Block[] = [
	{
		cwd: '~',
		command: 'cd ./garth'
	},
	{
		cwd: '~/garth',
		command: 'cat --pretty-format whoami.json',
		output: [
			{ kind: 'brace', text: '{' },
			pair('name', site.fullName),
			pair('role', 'Full-Stack Software Engineer'),
			pair('focus', 'Backend systems & business automation'),
			pair('location', 'Mandaluyong City, Philippines'),
			pair('timezone', 'Asia/Manila (UTC+8)'),
			{ ...pair('status', 'Employed — open to a good conversation'), last: true },
			{ kind: 'brace', text: '}' }
		]
	},
	{
		cwd: '~/garth',
		command: 'cat --pretty-format work.json',
		output: [
			{ kind: 'brace', text: '{' },
			pair('company', 'Dentalflo AI', site.company.href),
			pair('title', 'Full-Stack Software Engineer'),
			pair('since', 'August 2025'),
			pair('remote', 'Australia'),
			{ ...pair('owns', '[ tenant provisioning, telephony, payments ]'), last: true },
			{ kind: 'brace', text: '}' }
		]
	},
	{
		cwd: '~/garth',
		command: 'cat --pretty-format education.json',
		output: [
			{ kind: 'brace', text: '{' },
			pair('university', 'University of Saint Louis Tuguegarao'),
			pair('degree', 'BS Computer Science'),
			pair('honors', 'Cum Laude'),
			{ ...pair('graduated', '2024'), last: true },
			{ kind: 'brace', text: '}' }
		]
	},
	{
		cwd: '~/garth',
		command: 'cat --pretty-format contact.json',
		output: [
			{ kind: 'brace', text: '{' },
			pair('email', site.email, `mailto:${site.email}`),
			pair('phone', site.phone, `tel:${site.phoneHref}`),
			pair('linkedin', 'garth-ayang-ang', site.socials.linkedin),
			{ ...pair('github', 'garthzx', site.socials.github), last: true },
			{ kind: 'brace', text: '}' }
		]
	}
];
