import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import TableTest from './Table.spec.svelte';
import Table from './Table.svelte';

describe('Table Component Group', () => {
	it('renders table and its cell contents', () => {
		const { getByText, getByRole } = render(TableTest);

		expect(getByRole('table')).not.toBeNull();
		expect(getByText('Column 1')).not.toBeNull();
		expect(getByText('Column 2')).not.toBeNull();
		expect(getByText('Data 1')).not.toBeNull();
		expect(getByText('Data 2')).not.toBeNull();
	});

	it('accepts bordered prop', () => {
		const { container } = render(Table, { bordered: false });
		expect(container).toBeInTheDocument();
	});

	it('accepts borderedColumns prop', () => {
		const { container } = render(Table, { borderedColumns: false });
		expect(container).toBeInTheDocument();
	});

	it('accepts borderedRows prop', () => {
		const { container } = render(Table, { borderedRows: false });
		expect(container).toBeInTheDocument();
	});

	it('accepts compact prop', () => {
		const { container } = render(Table, { compact: false });
		expect(container).toBeInTheDocument();
	});

	it('accepts zebra prop', () => {
		const { container } = render(Table, { zebra: false });
		expect(container).toBeInTheDocument();
	});

	it('accepts zebraOdd prop', () => {
		const { container } = render(Table, { zebraOdd: false });
		expect(container).toBeInTheDocument();
	});

	it('renders caption snippet', () => {
		const { getByText } = render(TableTest);
		expect(getByText('Test Caption')).toBeInTheDocument();
	});
});
