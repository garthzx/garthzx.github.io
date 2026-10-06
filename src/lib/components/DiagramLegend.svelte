<ul class="legend" aria-label="Diagram key">
	<li>
		<svg width="28" height="8" aria-hidden="true"
			><line x1="0" y1="4" x2="28" y2="4" class="happy" /></svg
		>Happy path
	</li>
	<li>
		<svg width="28" height="8" aria-hidden="true"
			><line x1="0" y1="4" x2="28" y2="4" class="comp" /></svg
		>Compensation / rollback
	</li>
	<li>
		<svg width="28" height="8" aria-hidden="true"
			><line x1="0" y1="4" x2="28" y2="4" class="ink" /></svg
		>Call / write
	</li>
	<li>
		<svg width="12" height="12" aria-hidden="true"
			><rect x="0.75" y="0.75" width="10.5" height="10.5" rx="2" class="ext" /></svg
		>Third-party
	</li>
	<li>
		<svg width="10" height="10" aria-hidden="true"><circle cx="5" cy="5" r="4" class="ok" /></svg
		>Done
	</li>
	<li>
		<svg width="10" height="10" aria-hidden="true"
			><rect x="1.5" y="1.5" width="7" height="7" transform="rotate(45 5 5)" class="fail" /></svg
		>Failed
	</li>
	<li>
		<svg width="10" height="10" aria-hidden="true"
			><circle cx="5" cy="5" r="3.5" class="idle" /></svg
		>Not reached
	</li>
</ul>

<style>
	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 20px;
		margin: 0;
		padding: 0;
		list-style: none;
		font-family: var(--font-mono);
		font-size: 11px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--muted);
	}
	li {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.happy {
		stroke: var(--brand);
		stroke-width: 1.5;
	}
	.comp {
		stroke: var(--brass);
		stroke-width: 1.5;
		stroke-dasharray: 5 4;
	}
	.ink {
		stroke: var(--ink);
		stroke-width: 1.25;
	}
	.ext {
		fill: var(--tint);
		stroke: var(--ink);
		stroke-width: 1.5;
	}
	.ok {
		fill: var(--brand);
	}
	.fail {
		fill: var(--brass);
	}
	.idle {
		fill: none;
		stroke: var(--muted);
		stroke-width: 1.25;
	}
</style>
