import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import TableCell from './TableCell.svelte';

describe('TableCell Component', () => {
	it('renders without crashing', () => {
		const { container } = render(TableCell);
		expect(container).toBeTruthy();
	});

	it('accepts columnLabel prop', () => {
		const { container } = render(TableCell, { columnLabel: '' });
		expect(container).toBeInTheDocument();
	});
});
