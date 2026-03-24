import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import TableHeaderCell from './TableHeaderCell.svelte';

describe('TableHeaderCell Component', () => {
	it('renders without crashing', () => {
		const { container } = render(TableHeaderCell);
		expect(container).toBeTruthy();
	});

	it('accepts minWidth prop', () => {
		const { container } = render(TableHeaderCell, { minWidth: '0' });
		expect(container).toBeInTheDocument();
	});
});
