import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import TableHeaderTest from './TableHeader.spec.svelte';

describe('TableHeader and TableHeaderCell', () => {
	it('renders TableHeader with rowgroup role', () => {
		const { container } = render(TableHeaderTest);
		const rowgroup = container.querySelector('[role="rowgroup"]');
		expect(rowgroup).not.toBeNull();
	});

	it('renders TableHeaderCell with columnheader role', () => {
		const { container } = render(TableHeaderTest);
		const headers = container.querySelectorAll('[role="columnheader"]');
		expect(headers.length).toBe(2);
	});

	it('renders header cell text content', () => {
		const { getByText } = render(TableHeaderTest);
		expect(getByText('Name')).not.toBeNull();
		expect(getByText('Value')).not.toBeNull();
	});

	it('applies minWidth style to TableHeaderCell', () => {
		const { container } = render(TableHeaderTest);
		const headers = container.querySelectorAll('[role="columnheader"]');
		const valueHeader = headers[1] as HTMLElement;
		expect(valueHeader.style.minWidth).toBe('100px');
	});
});
