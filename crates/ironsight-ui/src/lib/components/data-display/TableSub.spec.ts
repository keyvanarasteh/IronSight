import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import TableSubTest from './TableSub.spec.svelte';

describe('Table Sub-Components', () => {
	it('renders TableBody with rowgroup role', () => {
		const { container } = render(TableSubTest);
		const rowgroups = container.querySelectorAll('[role="rowgroup"]');
		expect(rowgroups.length).toBeGreaterThanOrEqual(1);
	});

	it('renders TableRow with row role', () => {
		const { container } = render(TableSubTest);
		const row = container.querySelector('[role="row"]');
		expect(row).not.toBeNull();
	});

	it('renders TableCell with cell role and content', () => {
		const { getByText } = render(TableSubTest);
		expect(getByText('Cell A')).not.toBeNull();
		expect(getByText('Cell B')).not.toBeNull();

		const cells = document.querySelectorAll('[role="cell"]');
		expect(cells.length).toBe(2);
	});
});
